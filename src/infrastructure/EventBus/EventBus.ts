import { DomainEvent } from "../../domain/DomainEvent/DomainEvent";

export interface EventBus {
  subscribe(eventType: string, handler: (event: DomainEvent<unknown>) => void): void;
  publish(event: DomainEvent<unknown>): void;
}
