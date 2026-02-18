import type { Command } from '@core/Command.ts'
import type { Query } from '@core/Query.ts'
import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { Rejection } from '@domain/Rejection.ts'
import type { Repository } from '@domain/Repository.ts'
import type { EventConsumer, EventProducer } from '@infrastructure/EventBus/EventBus.ts'
import type { ExternalEvent } from '@infrastructure/EventBus/ExternalEvent.ts'
import type { IntegrationEvent } from '@infrastructure/EventBus/IntegrationEvent.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import type { Outbox } from '@infrastructure/Outbox/Outbox.ts'
import type { OutboxWorker } from '@infrastructure/Outbox/OutboxWorker.ts'
import type { CommandBus } from '../CommandBus/CommandBus.ts'
import type { QueryBus } from '../QueryBus/QueryBus.ts'
import { isCommand } from '@core/utils/isCommand.ts'
import { isQuery } from '@core/utils/isQuery.ts'
import { isDomainEvent } from '@domain/utils/isDomainEvent.ts'
import { isEvent } from '@domain/utils/isEvent.ts'
import { isRejection } from '@domain/utils/isRejection.ts'
import { fail } from '@utils/fail/fail.ts'
import { invariant } from '@utils/invariant/invariant.ts'
import { isEqual } from '@utils/isEqual/isEqual.ts'
import { isIntegrationEvent } from '../EventBus/utils/isIntegrationEvent.ts'

type GivenInput = DomainEvent[]
type WhenInput = Command | Query | DomainEvent | IntegrationEvent | ExternalEvent
type ThenInput = DomainEvent | Rejection | Array<Record<string, unknown>>

export class ScenarioTest<TState, TEvent extends DomainEvent> {
  private givenInput: GivenInput = []
  private whenInput: WhenInput | undefined

  constructor(
    private readonly streamName: string,
    private readonly eventBus: EventProducer<DomainEvent | IntegrationEvent | ExternalEvent> & EventConsumer<DomainEvent | IntegrationEvent | ExternalEvent>,
    private readonly eventStore: EventStore<TEvent, Promise<void>, Promise<TEvent[]>>,
    private readonly commandBus: CommandBus<Command>,
    private readonly queryBus: QueryBus<Query, Promise<Record<string, unknown>[]>>,
    private readonly repository: Repository<DomainEvent, Promise<TState>>,
    private readonly outboxWorker: OutboxWorker,
    private readonly outbox: Outbox,
  ) {}

  given(...events: GivenInput): {
    when(action: WhenInput): ReturnType<ScenarioTest<TState, TEvent>['when']>
    then(outcome: ThenInput): Promise<void>
  } {
    this.givenInput = events
    return {
      when: this.when.bind(this),
      then: this.then.bind(this),
    }
  }

  when(action: WhenInput): {
    then(outcome: ThenInput): Promise<void>
  } {
    this.whenInput = action
    return {
      then: this.then.bind(this),
    }
  }

  async then(thenInput: ThenInput): Promise<void> {
    await Promise.all([
      this.repository.store(this.givenInput),
      ...this.givenInput.map(async event => this.eventBus.consume(this.streamName, event)),
    ])

    if (!this.whenInput) {
      throw new Error('In the ScenarioTest, the when-step cannot be empty')
    }

    if (isCommand(this.whenInput)) {
      invariant(
        isDomainEvent(thenInput) || isRejection(thenInput),
        fail(new TypeError('When "command" expects a domain event or rejection in the then-step')),
      )
      await this.handleCommand(this.whenInput, thenInput)
      return
    }

    if (isQuery(this.whenInput)) {
      invariant(
        Array.isArray(thenInput),
        fail(new TypeError('When "query" expects an array of expected results in the then-step')),
      )
      await this.handleQuery(this.whenInput, thenInput)
      return
    }

    if (isDomainEvent(this.whenInput) || isIntegrationEvent(this.whenInput) || isEvent(this.whenInput)) {
      invariant(
        isDomainEvent(thenInput),
        fail(new TypeError('When "domain event" or "integration event" expects a domain event in the then-step')),
      )
      await this.handleEvent(this.whenInput as DomainEvent | IntegrationEvent, thenInput)
    }
  }

  private async handleCommand(command: Command, outcome: DomainEvent | Rejection): Promise<void> {
    await this.commandBus.execute(command)

    if (isRejection(outcome)) {
      const pending = await this.outbox.getPending()
      const foundRejection = pending.find(
        entry =>
          entry.event.metadata.outcome === 'rejected'
          && entry.event.metadata.commandType === outcome.commandType
          && (entry.event.payload as { reasonCode?: string }).reasonCode === outcome.reasonCode,
      )
      invariant(!!foundRejection, fail(new Error('ScenarioTest: rejection was not found in outbox')))
      return
    }

    const actualEvents = await this.eventStore.load(this.streamName, outcome.aggregateId)
    const foundEvent = actualEvents.findLast(
      event =>
        isDomainEvent(event)
        && event.aggregateId === outcome.aggregateId
        && event.type === outcome.type,
    )
    invariant(!!foundEvent, fail(new Error('ScenarioTest: event/command was not found')))
    invariant(
      outcome.type === foundEvent.type,
      fail(new Error('ScenarioTest: event/command type was not equal')),
    )
    invariant(
      outcome.aggregateId === foundEvent.aggregateId,
      fail(new Error('ScenarioTest: event/command aggregate id was not equal')),
    )
    invariant(
      isEqual(outcome.payload, foundEvent.payload),
      fail(new Error('ScenarioTest: event/command payload was not equal')),
    )
  }

  private async handleQuery(query: Query, expected: Array<Record<string, unknown>>): Promise<void> {
    await this.outboxWorker.tick()
    const actual = await this.queryBus.execute(query)
    invariant(
      isEqual(actual, expected),
      fail(new Error('ScenarioTest: a different query result was returned')),
    )
  }

  private async handleEvent(
    event: DomainEvent | IntegrationEvent,
    outcome: DomainEvent,
  ): Promise<void> {
    await this.eventBus.publish(this.streamName, event)
    const actualEvents = await this.eventStore.load(this.streamName, outcome.aggregateId)
    const foundEvent = actualEvents.findLast(
      event =>
        isEvent(event) && event.aggregateId === outcome.aggregateId && event.type === outcome.type,
    )
    invariant(!!foundEvent, fail(new Error('ScenarioTest: event was not found')))
    invariant(isEvent(foundEvent), fail(new Error('ScenarioTest: event is not of type event')))
    invariant(
      outcome.type === foundEvent.type,
      fail(new Error('ScenarioTest: event type was not equal')),
    )
    invariant(
      outcome.aggregateId === foundEvent.aggregateId,
      fail(new Error('ScenarioTest: event aggregate id was not equal')),
    )
    invariant(
      isEqual(outcome.payload, foundEvent.payload),
      fail(new Error('ScenarioTest: event payload was not equal')),
    )
  }
}
