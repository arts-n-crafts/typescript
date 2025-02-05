import type { IDomainEvent } from "../../domain/DomainEvent/DomainEvent";

export interface EventBus {
  subscribe(eventType: string, handler: (event: IDomainEvent) => void): void;
  publish(event: IDomainEvent): void;
}
