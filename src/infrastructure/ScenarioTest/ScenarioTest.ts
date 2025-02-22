import type { DomainEvent } from '../../domain/DomainEvent/DomainEvent'
import type { Command } from '../CommandBus/Command'
import type { CommandBus } from '../CommandBus/CommandBus'
import type { EventBus } from '../EventBus/EventBus'
import type { EventStore } from '../EventStore/EventStore'
import type { QueryBus } from '../QueryBus/QueryBus'

export class ScenarioTest {
  private events: DomainEvent<unknown>[] = []

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

  async when(command: Command<unknown>): Promise<ScenarioTest> {
    for (const event of this.events) {
      await this.eventStore.store(event)
    }
    await this.commandBus.execute(command)
    return this
  }

  // async then(event: DomainEvent<unknown>): Promise<void> {
  //   const actualEvents = await this.eventStore.loadEvents(event.aggregateId)
  //   expect(actualEvents[-1]).toEqual(event)
  // }
}
