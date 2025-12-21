import type { ExternalEvent } from '@infrastructure/EventBus/ExternalEvent.ts'
import type { IntegrationEventMetadata } from '../IntegrationEvent.ts'
import { createExternalEvent } from '@infrastructure/EventBus/utils/createExternalEvent.ts'

export interface ContractSignedPayload {
  userId: string
  product: '1' | '2' | '3'
}

export function createContractSigned(props: ContractSignedPayload, metadata?: Partial<IntegrationEventMetadata>): ExternalEvent<ContractSignedPayload> {
  return createExternalEvent('createContractSigned', props, metadata)
}

export type ContractSignedEvent = ReturnType<typeof createContractSigned>
