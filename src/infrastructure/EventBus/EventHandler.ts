import { DomainEvent } from "../../domain/DomainEvent/DomainEvent";

export interface EventHandler<TEvent extends DomainEvent<unknown>> {
  handle(event: TEvent): Promise<void>;
}
