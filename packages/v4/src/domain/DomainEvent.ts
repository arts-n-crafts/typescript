export interface DomainEventMetadata {
  correlationId?: string
  causationId?: string
  [key: string]: unknown
}

export interface DomainEvent<TPayload = unknown> {
  id: string
  type: string
  aggregateId: string
  source: 'internal'
  payload: TPayload
  timestamp: number
  metadata: Partial<DomainEventMetadata>
}
