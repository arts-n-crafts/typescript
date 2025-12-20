import type { ContractSignedPayload } from './examples/ContractSigned.ts'
import type { ProductCreatedPayload } from './examples/ProductCreated.ts'
import type { ExternalEventMetadata } from './ExternalEvent.ts'
import { randomUUID } from 'node:crypto'
import { ContractSigned } from './examples/ContractSigned.ts'
import { ProductCreated } from './examples/ProductCreated.ts'
import { createExternalEvent } from './utils/createExternalEvent.ts'
import { isExternalEvent } from './utils/isExternalEvent.ts'

describe('externalEvent', () => {
  let metadata: ExternalEventMetadata

  beforeEach(() => {
    metadata = {}
  })

  it('should be defined', () => {
    expect(createExternalEvent).toBeDefined()
  })

  it('should consider the event as ExternalEvent', () => {
    const payload: ContractSignedPayload = {
      userId: randomUUID(),
      product: '1',
    }
    const event = ContractSigned(payload, metadata)
    expect(isExternalEvent(event)).toBeTruthy()
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
    expect(event).toHaveProperty('timestamp')
    expect(event.kind).toBe('external')
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
    expect(event).toHaveProperty('timestamp')
    expect(event.kind).toBe('external')
  })
})
