import type { DomainEvent } from '@domain/DomainEvent.ts'

export interface Repository<TEvent extends DomainEvent> {
  readonly streamName: string

  load(aggregateId: string): Promise<unknown>

  store(events: TEvent[]): Promise<unknown>
}
