import type { IntegrationEvent, IntegrationEventMetadata } from '../IntegrationEvent.ts'
import { createIntegrationEvent } from '../utils/createIntegrationEvent.ts'

export interface ContractSignedPayload {
  userId: string
  product: '1' | '2' | '3'
}

export function ContractSigned(props: ContractSignedPayload, metadata?: Partial<IntegrationEventMetadata>): IntegrationEvent<ContractSignedPayload> {
  return createIntegrationEvent('ContractSigned', props, metadata)
}

export type ContractSignedEvent = ReturnType<typeof ContractSigned>
