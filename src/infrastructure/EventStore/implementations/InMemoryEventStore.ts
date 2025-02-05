import type { IDomainEvent } from "../../../domain/DomainEvent/DomainEvent";
import type { EventStore } from "../EventStore";

export class InMemoryEventStore implements EventStore {
  private events: Record<string, IDomainEvent[]> = {};

  async store(event: IDomainEvent): Promise<void> {
    const key = event.aggregateId;
    if (!this.events[key]) {
      this.events[key] = [event];
      return;
    }
    this.events[key].push(event);
  }

  async loadEvents(aggregateId: string): Promise<IDomainEvent[]> {
    return this.events[aggregateId] || [];
  }
}
