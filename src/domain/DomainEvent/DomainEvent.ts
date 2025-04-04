export interface DomainEventMetadata {
  eventId?: string
  correlationId?: string
  causationId?: string
  [key: string]: unknown
}

export interface DomainEvent<T = unknown> {
  type: string
  aggregateId: string
  payload: T
  metadata: {
    timestamp: string
    eventId: string
  } & Partial<DomainEventMetadata>
  version: number
}
