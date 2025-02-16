import { DomainEvent } from "../../domain/DomainEvent/DomainEvent";
import type { EventHandler } from "./EventHandler";

export class EventBus {
  private handlers: Array<EventHandler<DomainEvent<unknown>>> = [];

  subscribe(handler: EventHandler<DomainEvent<unknown>>): void {
    this.handlers.push(handler);
  }

  async publish(event: DomainEvent<unknown>): Promise<void> {
    await Promise.all(
      this.handlers.map(
        (handler) => handler.handle(event)
      )
    )
  }
}
