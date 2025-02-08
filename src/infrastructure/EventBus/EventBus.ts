import { DomainEvent } from "../../domain/DomainEvent/DomainEvent";
import type { EventHandler } from "./EventHandler";

export class EventBus {
  private handlers: Map<string, EventHandler<DomainEvent<unknown>>> = new Map();

  subscribe(eventName: string, handler: EventHandler<DomainEvent<unknown>>): void {
    this.handlers.set(eventName, handler);
  }

  publish(_event: DomainEvent<unknown>): void {
    throw new Error("Method not implemented.");
  }
}
