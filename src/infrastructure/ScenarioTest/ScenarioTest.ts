import type { DomainEvent } from '../../domain/DomainEvent/DomainEvent'
import type { Command } from '../CommandBus/Command'
import type { CommandBus } from '../CommandBus/CommandBus'
import type { EventBus } from '../EventBus/EventBus'
import type { EventStore } from '../EventStore/EventStore'
import type { Query } from '../QueryBus/Query'
import type { QueryBus } from '../QueryBus/QueryBus'
import { expect } from 'vitest'

export class ScenarioTest {
  private events: DomainEvent<unknown>[] = []
  private action: Command<unknown, unknown> | Query<unknown> | undefined

  constructor(
    private readonly eventStore: EventStore,
    private readonly _eventBus: EventBus,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  given(...events: DomainEvent<unknown>[]): ScenarioTest {
    this.events = events
    return this
  }

  when(action: Command<unknown, unknown> | Query<unknown>): ScenarioTest {
    this.action = action
    return this
  }

  async then(outcome: DomainEvent<unknown> | Record<string, unknown>[]): Promise<void> {
    await Promise.all(this.events.map(async event => this.eventStore.store(event)))

    if (!this.action) {
      throw new Error('No action provided')
    }

    if (this.isCommand(this.action)) {
      await this.commandBus.execute(this.action)
      if (Array.isArray(outcome)) {
        throw new TypeError(`Expected an event in then-step, but got Array`)
      }
      if (!this.isEvent(outcome)) {
        throw new TypeError(`Expected an event, but got ${typeof outcome}`)
      }
      const actualEvents = await this.eventStore.loadEvents(outcome.aggregateId)
      const foundEvent = actualEvents.find(event => event.aggregateId === outcome.aggregateId && event.constructor.name === outcome.constructor.name)
      if (!foundEvent) {
        throw new Error(`Event ${outcome.constructor.name} not found in the EventStore`)
      }
      expect(foundEvent).toBeDefined()
      expect(outcome.constructor.name === foundEvent.constructor.name).toBeTruthy()
    }

    if (this.isQuery(this.action)) {
      const queryResult = await this.queryBus.execute(this.action)
      expect(queryResult).toStrictEqual(outcome)
    }
  }

  private isCommand(action?: Command<unknown, unknown> | Query<unknown>): action is Command<unknown, unknown> {
    return Boolean(action && action.type === 'command')
  }

  private isQuery(action?: Command<unknown, unknown> | Query<unknown>): action is Query<unknown> {
    return Boolean(action && action.type === 'query')
  }

  private isEvent(outcome?: DomainEvent<unknown> | Record<string, unknown>): outcome is DomainEvent<unknown> {
    return Boolean(outcome && outcome.type === 'event')
  }
}
