import type { DomainEvent } from "@core/shapes/DomainEvent.ts";

export interface LoadsDomainEvents<TResult = Promise<DomainEvent>[]> {
  load(streamName: string, aggregateId: string): TResult;
}
