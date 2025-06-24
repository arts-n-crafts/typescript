import type { IntegrationEvent, IntegrationEventMetadata } from '../IntegrationEvent'
import { createIntegrationEvent } from '../utils/createIntegrationEvent'

export interface ProductCreatedPayload {
  productId: string
  name: string
}

export function ProductCreated(props: ProductCreatedPayload, metadata?: Partial<IntegrationEventMetadata>): IntegrationEvent<ProductCreatedPayload> {
  return createIntegrationEvent('ProductCreated', props, metadata)
}
