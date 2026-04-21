import { type LoadsDomainEvents } from "@adapters/outbound/LoadsDomainEvents.ts";

export class InMemoryEventStore<TEvent>
  implements LoadsDomainEvents<TEvent, TEvent[]> {
  load(streamName: string, aggregateId: string): TEvent[] {
    return []
  }
}
