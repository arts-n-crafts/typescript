import type { Decider } from '@domain/Decider.ts'
import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { Repository } from '@domain/Repository.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import type { ResultedEventStoreAppendReturnType } from '@infrastructure/EventStore/implementations/ResultedEventStore.ts'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'

export interface ResultedRepositoryResult { id: string }

export class ResultedRepository<TState, TCommand, TEvent extends DomainEvent>
implements Repository<TEvent, Result<TState, Error>, Result<ResultedRepositoryResult, Error>> {
  constructor(
    private readonly eventStore: EventStore<TEvent, ResultedEventStoreAppendReturnType, Result<TEvent[], Error>>,
    readonly streamName: string,
    private readonly evolveFn: Decider<TState, TCommand, TEvent>['evolve'],
    private readonly initialState: Decider<TState, TCommand, TEvent>['initialState'],
  ) {
  }

  async load(aggregateId: string): Promise<Result<TState, Error>> {
    const pastEventsResult = await this.eventStore.load(this.streamName, aggregateId)
    return Ok(
      pastEventsResult.unwrap()
        .reduce<TState>(this.evolveFn, this.initialState(aggregateId)),
    )
  }

  async store(events: TEvent[]): Promise<Result<ResultedRepositoryResult, Error>> {
    await Promise.all(
      events.map(
        async event => this.eventStore.append(
          this.streamName,
          [event],
        ),
      ),
    )
    return Ok({ id: events[0].aggregateId })
  }
}
