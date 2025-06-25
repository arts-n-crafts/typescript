import type { IntegrationEvent, IntegrationEventMetadata } from '../IntegrationEvent.ts'
import { createIntegrationEvent } from '../utils/createIntegrationEvent.ts'

export interface ProductCreatedPayload {
  productId: string
  name: string
}

export function ProductCreated(props: ProductCreatedPayload, metadata?: Partial<IntegrationEventMetadata>): IntegrationEvent<ProductCreatedPayload> {
  return createIntegrationEvent('ProductCreated', props, metadata)
}
