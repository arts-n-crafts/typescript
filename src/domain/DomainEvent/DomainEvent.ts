import type { Maybe } from "../../core/types/Maybe";

export interface DomainEventMetadata {
  timestamp?: Date;         // Time the event occurred
  userId?: string;          // ID of the user who caused the event (if applicable)
  correlationId?: string;   // For distributed tracing
  causationId?: string;     // ID of the command or event that caused this event
  eventId?: string;         // Unique ID of the event itself
  traceId?: string;         // ID for request tracing/debugging
  [key: string]: unknown;   // Additional metadata
}

export interface IDomainEvent {
  aggregateId: string
  payload: object
  metadata: Maybe<DomainEventMetadata>
}

export abstract class DomainEvent<
  TPayload extends object,
  TMetadata extends Maybe<DomainEventMetadata>
> implements IDomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly payload: TPayload,
    public readonly metadata: TMetadata
  ) {}
}
