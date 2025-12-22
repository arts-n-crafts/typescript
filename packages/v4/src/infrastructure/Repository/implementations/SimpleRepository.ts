import type { Decider } from '@domain/Decider.ts'
import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { Rejection } from '@domain/Rejection.ts'
import type { Repository } from '@domain/Repository.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'

export class SimpleRepository<TState, TCommand, TEvent extends DomainEvent, TRejection extends Rejection> implements Repository<TEvent, Promise<TState>, Promise<void>> {
  constructor(
    private readonly eventStore: EventStore<TEvent, Promise<void>, Promise<TEvent[]>>,
    readonly streamName: string,
    private readonly evolveFn: Decider<TState, TCommand, TEvent, TRejection>['evolve'],
    private readonly initialState: Decider<TState, TCommand, TEvent, TRejection>['initialState'],
  ) {
  }

  async load(aggregateId: string): Promise<TState> {
    const pastEvents = await this.eventStore.load(this.streamName, aggregateId)
    return pastEvents
      .reduce<TState>(this.evolveFn, this.initialState(aggregateId))
  }

  async store(events: TEvent[]): Promise<void> {
    await Promise.all(
      events.map(
        async event => this.eventStore.append(
          this.streamName,
          [event],
        ),
      ),
    )
  }
}
