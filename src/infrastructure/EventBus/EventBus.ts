import { DomainEvent } from "../../domain/DomainEvent/DomainEvent";
import type { EventHandler } from "./EventHandler";

export class EventBus {
  private handlers: Set<EventHandler<DomainEvent<unknown>>> = new Set();

  subscribe(handler: EventHandler<DomainEvent<unknown>>): void {
    this.handlers.add(handler);
  }

  publish(_event: DomainEvent<unknown>): void {
    throw new Error("Method not implemented.");
  }
}
