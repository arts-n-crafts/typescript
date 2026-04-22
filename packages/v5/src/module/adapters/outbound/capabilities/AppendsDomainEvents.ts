import type { DomainEvent } from "../../../core/shapes/DomainEvent.ts";

export interface AppendsDomainEvents<TDomainEvent extends DomainEvent, TReturn = Promise<void>> {
  append(domainEvents: TDomainEvent[]): TReturn;
}
