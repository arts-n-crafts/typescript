import type { AppendsDomainEvents } from "@adapters/outbound/AppendsDomainEvents.ts";
import { type LoadsDomainEvents } from "@adapters/outbound/LoadsDomainEvents.ts";
import type { DomainEvent } from "@core/shapes/DomainEvent.ts";

export class InMemoryEventStore<TEvent>
  implements LoadsDomainEvents<Promise<TEvent[]>>, AppendsDomainEvents<DomainEvent> {
  async load(streamName: string, aggregateId: string): Promise<TEvent[]> {
    return []
  }

  async append(aggregateId: string, domainEvents: DomainEvent[]): Promise<void> {
    return
  }
}
