import type { Decider } from '@domain/Decider.js'
import type { DomainEvent } from '@domain/DomainEvent.js'
import type { Repository } from '@domain/Repository.ts'
import type { InMemoryEventStore } from '@infrastructure/EventStore/implementations/InMemoryEventStore.js'
import { makeStreamKey } from '@utils/streamKey/index.js'

export class InMemoryRepository<TState, TCommand, TEvent extends DomainEvent<unknown>> implements Repository {
  constructor(
    private readonly eventStore: InMemoryEventStore,
    private readonly streamName: string,
    private readonly evolveFn: Decider<TState, TCommand, TEvent>['evolve'],
    private readonly initialState: Decider<TState, TCommand, TEvent>['initialState'],
  ) {
  }

  async load(aggregateId: string): Promise<TState> {
    const pastEvents = await this.eventStore.load<TEvent>(
      makeStreamKey(this.streamName, aggregateId),
    )
    return pastEvents.reduce(this.evolveFn, this.initialState(aggregateId))
  }

  async store<TEvent extends DomainEvent<TEvent['payload']>>(events: TEvent[]): Promise<void> {
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
