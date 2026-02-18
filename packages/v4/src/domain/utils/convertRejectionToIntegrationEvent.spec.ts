import type { Rejection } from '@domain/Rejection.ts'
import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { convertRejectionToIntegrationEvent } from './convertRejectionToIntegrationEvent.ts'

describe('convertRejectionToIntegrationEvent', () => {
  const rejection: Rejection = {
    id: randomUUID(),
    type: 'CreateUserRejected',
    kind: 'rejection',
    commandId: randomUUID(),
    commandType: 'CreateUser',
    reasonCode: 'ALREADY_EXISTS',
    reason: 'User already exists',
    classification: 'business',
    timestamp: Date.now(),
    metadata: {
      aggregateType: 'User',
      aggregateId: randomUUID(),
    },
  }

  it('should produce an integration event with kind integration', () => {
    const result = convertRejectionToIntegrationEvent(rejection)
    expect(result.kind).toBe('integration')
  })

  it('should use the commandType as the event type', () => {
    const result = convertRejectionToIntegrationEvent(rejection)
    expect(result.type).toBe(rejection.commandType)
  })

  it('should set outcome to rejected in metadata', () => {
    const result = convertRejectionToIntegrationEvent(rejection)
    expect(result.metadata.outcome).toBe('rejected')
  })

  it('should carry commandType and commandId in metadata', () => {
    const result = convertRejectionToIntegrationEvent(rejection)
    expect(result.metadata.commandType).toBe(rejection.commandType)
    expect(result.metadata.commandId).toBe(rejection.commandId)
  })

  it('should carry aggregateType and aggregateId in metadata', () => {
    const result = convertRejectionToIntegrationEvent(rejection)
    expect(result.metadata.aggregateType).toBe(rejection.metadata?.aggregateType)
    expect(result.metadata.aggregateId).toBe(rejection.metadata?.aggregateId)
  })

  it('should include reasonCode in the payload', () => {
    const result = convertRejectionToIntegrationEvent(rejection)
    expect((result.payload as { reasonCode: string }).reasonCode).toBe(rejection.reasonCode)
  })
})
