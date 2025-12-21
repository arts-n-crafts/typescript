import type { ExternalEvent } from '@infrastructure/EventBus/ExternalEvent.ts'
import type { IntegrationEventMetadata } from '../IntegrationEvent.ts'
import { createExternalEvent } from '@infrastructure/EventBus/utils/createExternalEvent.ts'

export interface ProductCreatedPayload {
  productId: string
  name: string
}

export function ProductCreated(props: ProductCreatedPayload, metadata?: Partial<IntegrationEventMetadata>): ExternalEvent<ProductCreatedPayload> {
  return createExternalEvent('ProductCreated', props, metadata)
}
