import type { ContractSignedPayload } from './examples/ContractSigned.ts'
import type { ProductCreatedPayload } from './examples/ProductCreated.ts'
import type { IntegrationEventMetadata } from './IntegrationEvent.ts'
import { randomUUID } from 'node:crypto'
import { ContractSigned } from './examples/ContractSigned.ts'
import { ProductCreated } from './examples/ProductCreated.ts'
import { createIntegrationEvent } from './utils/createIntegrationEvent.ts'
import { isIntegrationEvent } from './utils/isIntegrationEvent.ts'

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

  it('should create the ProductCreated event', () => {
    const payload: ProductCreatedPayload = {
      productId: '1',
      name: 'starlink',
    }
    const event = ProductCreated(payload, metadata)
    expect(event.id).toBeDefined()
    expect(event.type).toBe('ProductCreated')
    expect(event.payload).toBe(payload)
    expect(event.metadata).toHaveProperty('timestamp')
  })
})
