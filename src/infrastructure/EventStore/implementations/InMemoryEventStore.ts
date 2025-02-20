import { DomainEvent } from "../../../domain/DomainEvent/DomainEvent";
import { EventStore } from "../EventStore";

export class InMemoryEventStore extends EventStore {
  private events: Record<string, DomainEvent<unknown>[]> = {};

  async store(event: DomainEvent<unknown>): Promise<void> {
    const key = event.aggregateId;
    if (!this.events[key]) {
      this.events[key] = [event];
      return;
    }
    this.events[key].push(event);
    await this.eventBus.publish(event);
  }

  async loadEvents(aggregateId: string): Promise<DomainEvent<unknown>[]> {
    return [...(this.events[aggregateId] || [])];
  }
}
