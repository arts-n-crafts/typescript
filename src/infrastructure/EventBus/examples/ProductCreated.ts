import type { IntegrationEventMetadata } from '../IntegrationEvent'
import { createIntegrationEvent } from '../utils/createIntegrationEvent'

export interface ProductCreatedPayload {
  productId: string
  name: string
}

export function ProductCreated(props: ProductCreatedPayload, metadata?: Partial<IntegrationEventMetadata>) {
  return createIntegrationEvent('ProductCreated', props, metadata)
}
