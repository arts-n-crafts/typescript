import type { DomainEvent } from '../../domain'
import type { Command } from '../CommandBus/Command'
import type { CommandBus } from '../CommandBus/CommandBus'
import type { BaseEvent } from '../EventBus/Event'
import type { EventBus } from '../EventBus/EventBus'
import type { IntegrationEvent } from '../EventBus/IntegrationEvent'
import type { EventStore } from '../EventStore/EventStore'
import type { Query } from '../QueryBus/Query'
import type { QueryBus } from '../QueryBus/QueryBus'
import { isDomainEvent } from '../../domain/DomainEvent/utils/isDomainEvent'
import { isEvent } from '../EventBus/utils/isEvent'
import { isIntegrationEvent } from '../EventBus/utils/isIntegrationEvent'

type GivenInput = BaseEvent[]
type WhenInput = Command<unknown, unknown> | Query<unknown> | BaseEvent
type ThenInput = BaseEvent | Record<string, unknown>[]

export class ScenarioTest {
  private events: GivenInput = []
  private action: WhenInput | undefined

  constructor(
    private readonly eventStore: EventStore,
    private readonly eventBus: EventBus,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  given(...events: GivenInput): ScenarioTest {
    this.events = events
    return this
  }

  when(action: WhenInput): ScenarioTest {
    this.action = action
    return this
  }

  async then(outcome: ThenInput): Promise<void> {
    await Promise.all(this.events.map(async (event) => {
      if (this.isIntegrationEvent(event))
        return this.eventBus.publish(event)
      return this.eventStore.store(event)
    }))

    if (!this.action) {
      throw new Error('In the ScenarioTest, "when" cannot be empty')
    }

    if (this.isCommand(this.action)) {
      await this.handleCommand(this.action, outcome)
    }

    if (this.isQuery(this.action)) {
      await this.handleQuery(this.action, outcome)
    }

    if (this.isEvent(this.action)) {
      await this.handleEvent(this.action, outcome)
    }
  }

  private isCommand(candidate?: WhenInput): candidate is Command<unknown, unknown> {
    return Boolean(candidate && candidate.type === 'command')
  }

  private isQuery(candidate?: WhenInput): candidate is Query<unknown> {
    return Boolean(candidate && candidate.type === 'query')
  }

  private isEvent(candidate: WhenInput | ThenInput): candidate is BaseEvent {
    return isEvent(candidate)
  }

  private isDomainEvent(candidate: WhenInput | ThenInput): candidate is DomainEvent {
    return this.isEvent(candidate) && isDomainEvent(candidate)
  }

  private isIntegrationEvent(candidate: WhenInput | ThenInput): candidate is IntegrationEvent {
    return this.isEvent(candidate) && isIntegrationEvent(candidate)
  }

  private async handleCommand(command: Command<unknown, unknown>, outcome: ThenInput) {
    await this.commandBus.execute(command)
    if (!this.isDomainEvent(outcome)) {
      throw new TypeError(`In the ScenarioTest, when triggering a command, then an event is expected`)
    }
    const actualEvents = await this.eventStore.loadEvents(outcome.aggregateId)
    const foundEvent = actualEvents.findLast(event =>
      this.isDomainEvent(event)
      && event.aggregateId === outcome.aggregateId
      && event.type === outcome.type,
    )
    if (!foundEvent) {
      throw new Error(`In the ScenarioTest, the expected then event (${outcome.type}) was not triggered`)
    }
    expect(foundEvent).toBeDefined()
    expect(outcome.type === foundEvent.type).toBeTruthy()
    expect(outcome.aggregateId).toEqual(foundEvent.aggregateId)
    expect(outcome.payload).toStrictEqual(foundEvent.payload)
  }

  private async handleQuery(query: Query<unknown>, outcome: ThenInput) {
    const queryResult = await this.queryBus.execute(query)
    expect(queryResult).toStrictEqual(outcome)
  }

  private async handleEvent(event: BaseEvent, outcome: ThenInput) {
    await this.eventBus.publish(event)
    if (!this.isDomainEvent(outcome)) {
      throw new TypeError(`In the ScenarioTest, when triggering from event, then an event is expected`)
    }

    const actualEvents = await this.eventStore.loadEvents(outcome.aggregateId)
    const foundEvent = actualEvents.findLast(event =>
      this.isEvent(event)
      && event.aggregateId === outcome.aggregateId
      && event.type === outcome.type,
    )
    if (!foundEvent || !this.isEvent(foundEvent)) {
      throw new Error(`In the ScenarioTest, the expected then event (${outcome.type}) was not triggered`)
    }
    expect(foundEvent).toBeDefined()
    expect(outcome.type === foundEvent.type).toBeTruthy()
    expect(outcome.aggregateId).toEqual(foundEvent.aggregateId)
    expect(outcome.payload).toStrictEqual(foundEvent.payload)
  }
}
