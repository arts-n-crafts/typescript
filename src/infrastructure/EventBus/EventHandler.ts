import { type IDomainEvent } from "../../domain/DomainEvent/DomainEvent";

export interface EventHandler<TEvent extends IDomainEvent> {
  handle(event: TEvent): Promise<void>;
}
