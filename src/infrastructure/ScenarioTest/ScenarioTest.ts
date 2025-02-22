import type { DomainEvent } from '../../domain/DomainEvent/DomainEvent'
import type { Command } from '../CommandBus/Command'
import type { CommandBus } from '../CommandBus/CommandBus'
import type { EventBus } from '../EventBus/EventBus'
import type { EventStore } from '../EventStore/EventStore'
import type { QueryBus } from '../QueryBus/QueryBus'
import { expect } from 'vitest'

export class ScenarioTest {
  private events: DomainEvent<unknown>[] = []
  private command: Command<unknown> | undefined

  constructor(
    private readonly eventStore: EventStore,
    private readonly _eventBus: EventBus,
    private readonly commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}

  given(...events: DomainEvent<unknown>[]): ScenarioTest {
    this.events = events
    return this
  }

  when(command: Command<unknown>): ScenarioTest {
    this.command = command
    return this
  }

  async then(event: DomainEvent<unknown>): Promise<void> {
    await Promise.all(this.events.map(async event => this.eventStore.store(event)))

    if (this.command) {
      await this.commandBus.execute(this.command)

      const actualEvents = await this.eventStore.loadEvents(event.aggregateId)
      const foundEvent = actualEvents.find(e => e.aggregateId === event.aggregateId)
      expect(foundEvent).toBeDefined()
    }
  }
}
