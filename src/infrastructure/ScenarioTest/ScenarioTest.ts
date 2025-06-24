import type { Command, DomainEvent, Query } from '../../domain'
import type { UserEvent } from '../../domain/examples/User'
import type { CommandBus } from '../CommandBus/CommandBus'
import type { EventBus } from '../EventBus/EventBus'
import type { IntegrationEvent } from '../EventBus/IntegrationEvent'
import type { EventStore } from '../EventStore/EventStore'
import type { QueryBus } from '../QueryBus/QueryBus'
import {

  isCommand,
  isDomainEvent,
  isEvent,
  isQuery,
} from '../../domain'
import { fail, invariant, isEqual } from '../../utils'
import { isIntegrationEvent } from '../EventBus/utils/isIntegrationEvent'

type GivenInput = (DomainEvent<unknown> | IntegrationEvent<unknown>)[]
type WhenInput
  = | Command<string, unknown>
    | Query
    | DomainEvent<unknown>
    | IntegrationEvent<unknown>
type ThenInput = DomainEvent<unknown> | Record<string, unknown>[]

export class ScenarioTest {
  private events: GivenInput = []
  private action: WhenInput | undefined

  constructor(
    private readonly eventStore: EventStore<UserEvent>,
    private readonly eventBus: EventBus<UserEvent>,
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
    await Promise.all(
      this.events.map(async (event) => {
        if (this.isDomainEvent(event))
        // eslint-disable-next-line ts/no-unsafe-argument
          return this.eventStore.store(event as any)
        // eslint-disable-next-line ts/no-unsafe-argument
        return this.eventBus.publish(event as any)
      }),
    )

    if (!this.action) {
      throw new Error('In the ScenarioTest, "when" cannot be empty')
    }

    if (isCommand(this.action)) {
      await this.handleCommand(this.action, outcome)
    }

    if (isQuery(this.action)) {
      await this.handleQuery(this.action, outcome)
    }

    if (this.isDomainEvent(this.action) || this.isIntegrationEvent(this.action)) {
      // eslint-disable-next-line ts/no-unsafe-argument
      await this.handleEvent(this.action as any, outcome)
    }
  }

  private isDomainEvent(candidate: WhenInput | ThenInput): candidate is DomainEvent<unknown> {
    return isEvent(candidate) && isDomainEvent(candidate)
  }

  private isIntegrationEvent(
    candidate: WhenInput | ThenInput,
  ): candidate is IntegrationEvent<unknown> {
    return isEvent(candidate) && isIntegrationEvent(candidate)
  }

  private async handleCommand(command: Command<string, unknown>, outcome: ThenInput) {
    if (!this.isDomainEvent(outcome)) {
      throw new TypeError(
        `In the ScenarioTest, when triggering a command, then a domain event is expected`,
      )
    }

    await this.commandBus.execute(command)
    const actualEvents = await this.eventStore.loadEvents(outcome.aggregateId)
    const foundEvent = actualEvents.findLast(
      event =>
        this.isDomainEvent(event)
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

  private async handleQuery(query: Query, outcome: ThenInput) {
    const queryResult = await this.queryBus.execute(query)
    invariant(
      isEqual(queryResult, outcome),
      fail(new Error('ScenarioTest: a different query result was returned')),
    )
  }

  private async handleEvent(
    event: DomainEvent<unknown> & IntegrationEvent<unknown>,
    outcome: ThenInput,
  ) {
    await this.eventBus.publish(event)
    if (!this.isDomainEvent(outcome)) {
      throw new TypeError(
        `In the ScenarioTest, when triggering from event, then an event is expected`,
      )
    }

    const actualEvents = await this.eventStore.loadEvents(outcome.aggregateId)
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
