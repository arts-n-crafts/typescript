import type { ContractSignedPayload } from './examples/ContractSigned'
import type { IntegrationEventMetadata } from './IntegrationEvent'
import { randomUUID } from 'node:crypto'
import { ContractSigned } from './examples/ContractSigned'
import { createIntegrationEvent } from './utils/createIntegrationEvent'
import { isIntegrationEvent } from './utils/isIntegrationEvent'

describe('integrationEvent', () => {
  let metadata: IntegrationEventMetadata

  beforeEach(() => {
    metadata = {}
  })

  it('should be defined', () => {
    expect(createIntegrationEvent).toBeDefined()
  })

  it('should consider the event as IntegrationEvent', () => {
    const payload: ContractSignedPayload = {
      userId: randomUUID(),
      product: '1',
    }
    const event = ContractSigned(payload, metadata)
    expect(isIntegrationEvent(event)).toBeTruthy()
  })

  it('should create the ContractSigned event', () => {
    const payload: ContractSignedPayload = {
      userId: randomUUID(),
      product: '1',
    }
    const event = ContractSigned(payload, metadata)
    expect(event.id).toBeDefined()
    expect(event.type).toBe('ContractSigned')
    expect(event.payload).toBe(payload)
    expect(event.metadata).toHaveProperty('timestamp')
  })
})
