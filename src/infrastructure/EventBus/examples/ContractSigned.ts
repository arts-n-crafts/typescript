import type { IntegrationEvent, IntegrationEventMetadata } from '../IntegrationEvent'
import { createIntegrationEvent } from '../utils/createIntegrationEvent'

export interface ContractSignedPayload {
  userId: string
  product: '1' | '2' | '3'
}

export function ContractSigned(props: ContractSignedPayload, metadata?: Partial<IntegrationEventMetadata>): IntegrationEvent<ContractSignedPayload> {
  return createIntegrationEvent('ContractSigned', props, metadata)
}
