import type { DomainEvent } from '../../domain/DomainEvent/DomainEvent'
import type { CommandBus } from '../CommandBus/CommandBus'
import type { EventBus } from '../EventBus/EventBus'
import type { EventStore } from '../EventStore/EventStore'
import type { QueryBus } from '../QueryBus/QueryBus'

export class ScenarioTest {
  constructor(
    private readonly eventStore: EventStore,
    private readonly _eventBus: EventBus,
    private readonly commandBus: CommandBus,
    private readonly _queryBus: QueryBus,
  ) {}

  async given(...events: DomainEvent<unknown>[]): Promise<this> {
    for (const event of events) {
      await this.eventStore.store(event)
    }
    return this
  }

  // async when(command: Command<unknown>): Promise<this> {
  //   await this.commandBus.execute(command)
  //   return this
  // }

  // async then(event: DomainEvent<unknown>): Promise<void> {
  //   const actualEvents = await this.eventStore.loadEvents(event.aggregateId)
  //   expect(actualEvents[-1]).toEqual(event)
  // }
}
