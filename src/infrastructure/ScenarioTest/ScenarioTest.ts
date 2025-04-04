import type { DomainEvent } from '../../domain/DomainEvent/DomainEvent'
import type { Command } from '../CommandBus/Command'
import type { CommandBus } from '../CommandBus/CommandBus'
import type { Event } from '../EventBus/Event'
import type { EventBus } from '../EventBus/EventBus'
import type { EventStore } from '../EventStore/EventStore'
import type { Query } from '../QueryBus/Query'
import type { QueryBus } from '../QueryBus/QueryBus'
import { isDomainEvent } from '../../domain/DomainEvent/utils/isDomainEvent'

type GivenInput = Event[]
type WhenInput = Command<unknown, unknown> | Query<unknown> | Event
type ThenInput = Event | Record<string, unknown>[]

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
      if (!this.isDomainEvent(outcome)) {
        throw new TypeError(`In the ScenarioTest, when triggering a command, then an event is expected`)
      }
      const actualEvents = await this.eventStore.loadEvents(outcome.aggregateId)
      const foundEvent = actualEvents.findLast(event =>
        this.isDomainEvent(event)
        && event.aggregateId === outcome.aggregateId
        && event.type === outcome.type,
      )
      if (!foundEvent || !this.isDomainEvent(foundEvent)) {
        throw new Error(`In the ScenarioTest, the expected then event (${outcome.type}) was not triggered`)
      }
      expect(foundEvent).toBeDefined()
      expect(outcome.type === foundEvent.type).toBeTruthy()
      expect(outcome.aggregateId).toEqual(foundEvent.aggregateId)
      expect(outcome.payload).toStrictEqual(foundEvent.payload)
    }

    if (this.isQuery(this.action)) {
      const queryResult = await this.queryBus.execute(this.action)
      expect(queryResult).toStrictEqual(outcome)
    }

    if (this.isDomainEvent(this.action)) {
      await this.eventBus.publish(this.action)
      if (!this.isDomainEvent(outcome)) {
        throw new TypeError(`In the ScenarioTest, when triggering from event, then an event is expected`)
      }

      const actualEvents = await this.eventStore.loadEvents(outcome.aggregateId)
      const foundEvent = actualEvents.findLast(event =>
        this.isDomainEvent(event)
        && event.aggregateId === outcome.aggregateId
        && event.type === outcome.type,
      )
      if (!foundEvent || !this.isDomainEvent(foundEvent)) {
        throw new Error(`In the ScenarioTest, the expected then event (${outcome.type}) was not triggered`)
      }
      expect(foundEvent).toBeDefined()
      expect(outcome.type === foundEvent.type).toBeTruthy()
      expect(outcome.aggregateId).toEqual(foundEvent.aggregateId)
      expect(outcome.payload).toStrictEqual(foundEvent.payload)
    }
  }

  private isCommand(candidate?: WhenInput): candidate is Command<unknown, unknown> {
    return Boolean(candidate && candidate.type === 'command')
  }

  private isQuery(candidate?: WhenInput): candidate is Query<unknown> {
    return Boolean(candidate && candidate.type === 'query')
  }

  private isDomainEvent(candidate: WhenInput | ThenInput): candidate is DomainEvent {
    return isDomainEvent(candidate)
  }
}
