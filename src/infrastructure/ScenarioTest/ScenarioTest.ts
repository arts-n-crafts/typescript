import type { DomainEvent } from '../../domain'
import type { Command } from '../CommandBus/Command'
import type { CommandBus } from '../CommandBus/CommandBus'
import type { EventBus } from '../EventBus/EventBus'
import type { EventStore } from '../EventStore/EventStore'
import type { Query } from '../QueryBus/Query'
import type { QueryBus } from '../QueryBus/QueryBus'

type GivenInput = DomainEvent<unknown>[]
type WhenInput = Command<unknown, unknown> | Query<unknown> | DomainEvent<unknown>
type ThenInput = DomainEvent<unknown> | Record<string, unknown>[]

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
    await Promise.all(this.events.map(async event => this.eventStore.store(event)))

    if (!this.action) {
      throw new Error('In the ScenarioTest, "when" cannot be empty')
    }

    if (this.isCommand(this.action)) {
      await this.commandBus.execute(this.action)
      if (!this.isEvent(outcome)) {
        throw new TypeError(`In the ScenarioTest, when triggering a command, then an event is expected`)
      }
      const actualEvents = await this.eventStore.loadEvents(outcome.aggregateId)
      const foundEvent = actualEvents.findLast(event => event.aggregateId === outcome.aggregateId && event.constructor.name === outcome.constructor.name)
      if (!foundEvent) {
        throw new Error(`In the ScenarioTest, the expected then event (${outcome.constructor.name}) was not triggered`)
      }
      expect(foundEvent).toBeDefined()
      expect(outcome.constructor.name === foundEvent.constructor.name).toBeTruthy()
    }

    if (this.isQuery(this.action)) {
      const queryResult = await this.queryBus.execute(this.action)
      expect(queryResult).toStrictEqual(outcome)
    }

    if (this.isEvent(this.action)) {
      await this.eventBus.publish(this.action)
      if (!this.isEvent(outcome)) {
        throw new TypeError(`In the ScenarioTest, when triggering from event, then an event is expected`)
      }

      const actualEvents = await this.eventStore.loadEvents(outcome.aggregateId)
      const foundEvent = actualEvents.findLast(event => event.aggregateId === outcome.aggregateId && event.constructor.name === outcome.constructor.name)
      if (!foundEvent) {
        throw new Error(`In the ScenarioTest, the expected then event (${outcome.constructor.name}) was not triggered`)
      }
      expect(foundEvent).toBeDefined()
      expect(outcome.constructor.name === foundEvent.constructor.name).toBeTruthy()
    }
  }

  private isCommand(candidate?: WhenInput): candidate is Command<unknown, unknown> {
    return Boolean(candidate && candidate.type === 'command')
  }

  private isQuery(candidate?: WhenInput): candidate is Query<unknown> {
    return Boolean(candidate && candidate.type === 'query')
  }

  private isEvent(candidate: WhenInput | ThenInput): candidate is DomainEvent<unknown> {
    if (!('type' in candidate))
      return false
    return Boolean(['event'].includes(candidate.type))
  }
}
