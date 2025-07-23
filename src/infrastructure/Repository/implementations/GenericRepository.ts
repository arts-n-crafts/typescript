import type { Decider } from '@domain/Decider.ts'
import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { Repository } from '@domain/Repository.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.js'
import { makeStreamKey } from '@utils/streamKey/index.ts'

export class GenericRepository<TState, TCommand, TEvent extends DomainEvent> implements Repository<TState, TEvent> {
  constructor(
    private readonly eventStore: EventStore,
    readonly streamName: string,
    private readonly evolveFn: Decider<TState, TCommand, TEvent>['evolve'],
    private readonly initialState: Decider<TState, TCommand, TEvent>['initialState'],
  ) {
  }

  async load(aggregateId: string): Promise<TState> {
    const pastEvents = await this.eventStore.load<TEvent[]>(
      makeStreamKey(this.streamName, aggregateId),
    )
    return pastEvents
      .reduce<TState>(this.evolveFn, this.initialState(aggregateId))
  }

  async store(events: TEvent[]): Promise<void> {
    await Promise.all(
      events.map(
        async event => this.eventStore.append(
          makeStreamKey(this.streamName, event.aggregateId),
          [event],
        ),
      ),
    )
  }
}
