import type { IntegrationEventMetadata } from '../IntegrationEvent'
import { createIntegrationEvent } from '../createIntegrationEvent'

export interface ContractSignedPayload {
  userId: string
  product: '1' | '2' | '3'
}

export function ContractSigned(props: ContractSignedPayload, metadata?: Partial<IntegrationEventMetadata>) {
  return createIntegrationEvent('ContractSigned', props, metadata)
}
