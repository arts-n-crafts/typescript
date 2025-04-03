import type { Maybe } from '../../core/types/Maybe'
import { randomUUID } from 'node:crypto'

export interface EventMetadataProps {
  userId?: string // ID of the user who caused the event (if applicable)
  correlationId?: string // For distributed tracing
  causationId?: string // ID of the command or event that caused this event
  traceId?: string // ID for request tracing/debugging
  [key: string]: unknown // Additional metadata
}

interface EventMetadata extends EventMetadataProps {
  timestamp?: Date // Time the event occurred
  eventId?: string // Unique ID of the event itself
}

export abstract class Event<TPayload> {
  private readonly _payload: TPayload
  private _metadata?: Maybe<EventMetadata>

  constructor(payload: TPayload) {
    this._payload = payload
    this._metadata = {
      eventId: randomUUID(),
      timestamp: new Date(),
    }
  }

  applyMetadata(metadata: Maybe<EventMetadataProps>) {
    this._metadata = { ...this._metadata, ...metadata }
  }

  get payload(): TPayload {
    return this._payload
  }

  get metadata(): Maybe<EventMetadata> {
    return this._metadata
  }

  get type(): string {
    return 'event'
  }
}
