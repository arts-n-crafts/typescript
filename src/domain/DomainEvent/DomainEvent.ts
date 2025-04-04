export interface DomainEventMetadata {
  correlationId?: string
  causationId?: string
  [key: string]: unknown
}

export interface DomainEvent<T = unknown> {
  id: string
  type: string
  aggregateId: string
  payload: T
  metadata: {
    timestamp: string
  } & Partial<DomainEventMetadata>
  version: number
}
