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

export abstract class DomainEvent<TPayload> {
  private readonly _aggregateId: string;
  private readonly _payload: TPayload;
  private _metadata?: Maybe<DomainEventMetadata>;

  constructor(
    aggregateId: string,
    payload: TPayload
  ) {
    this._aggregateId = aggregateId;
    this._payload = payload;
  }

  applyMetadata(metadata: Maybe<DomainEventMetadata>) {
    this._metadata = metadata;
  }

  get aggregateId() {
    return this._aggregateId;
  }
  get payload() {
    return this._payload;
  }
  get metadata(): Maybe<DomainEventMetadata> {
    return this._metadata;
  }
}
