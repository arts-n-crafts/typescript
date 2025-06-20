import type { Command, DomainEvent, Query } from '../../domain'
import type { BaseEvent } from '../../domain/BaseEvent.ts'
import type { UserEvent } from '../../domain/examples/User.ts'
import type { CommandBus } from '../CommandBus/CommandBus.ts'
import type { EventBus } from '../EventBus/EventBus.ts'
import type { IntegrationEvent } from '../EventBus/IntegrationEvent.ts'
import type { EventStore } from '../EventStore/EventStore.ts'
import type { QueryBus } from '../QueryBus/QueryBus.ts'
import { isCommand, isDomainEvent, isEvent, isQuery } from '../../domain'

type GivenInput = (DomainEvent<any> | IntegrationEvent<any>)[]
type WhenInput = Command<string, unknown> | Query | BaseEvent
type ThenInput = BaseEvent | Record<string, unknown>[]

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
    await Promise.all(this.events.map(async (event) => {
      if (this.isDomainEvent(event))
        return this.eventStore.store(event)
      // eslint-disable-next-line ts/no-unsafe-argument
      return this.eventBus.publish(event as any)
    }))

    if (!this.action) {
      throw new Error('In the ScenarioTest, "when" cannot be empty')
    }

    if (isCommand(this.action)) {
      await this.handleCommand(this.action, outcome)
    }

    if (isQuery(this.action)) {
      await this.handleQuery(this.action, outcome)
    }

    if (isEvent(this.action)) {
      await this.handleEvent(this.action, outcome)
    }
  }

  private isDomainEvent(candidate: WhenInput | ThenInput): candidate is DomainEvent<any> {
    return isEvent(candidate) && isDomainEvent(candidate)
  }

  private async handleCommand(command: Command<string, unknown>, outcome: ThenInput) {
    if (!this.isDomainEvent(outcome)) {
      throw new TypeError(`In the ScenarioTest, when triggering a command, then a domain event is expected`)
    }

    await this.commandBus.execute(command)
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

  private async handleQuery(query: Query, outcome: ThenInput) {
    const queryResult = await this.queryBus.execute(query)
    expect(queryResult).toStrictEqual(outcome)
  }

  private async handleEvent(event: BaseEvent, outcome: ThenInput) {
    // eslint-disable-next-line ts/no-unsafe-argument
    await this.eventBus.publish(event as any)
    if (!this.isDomainEvent(outcome)) {
      throw new TypeError(`In the ScenarioTest, when triggering from event, then an event is expected`)
    }

    const actualEvents = await this.eventStore.loadEvents(outcome.aggregateId)
    const foundEvent = actualEvents.findLast(event =>
      isEvent(event)
      && event.aggregateId === outcome.aggregateId
      && event.type === outcome.type,
    )
    if (!foundEvent || !isEvent(foundEvent)) {
      throw new Error(`In the ScenarioTest, the expected then event (${outcome.type}) was not triggered`)
    }
    expect(foundEvent).toBeDefined()
    expect(outcome.type === foundEvent.type).toBeTruthy()
    expect(outcome.aggregateId).toEqual(foundEvent.aggregateId)
    expect(outcome.payload).toStrictEqual(foundEvent.payload)
  }
}
