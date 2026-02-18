import type { Rejection } from '@domain/Rejection.ts'
import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { isRejection } from './isRejection.ts'

describe('isRejection', () => {
  const rejection: Rejection = {
    id: randomUUID(),
    type: 'CreateUserRejected',
    kind: 'rejection',
    commandId: randomUUID(),
    commandType: 'CreateUser',
    reasonCode: 'ALREADY_EXISTS',
    timestamp: Date.now(),
  }

  it('should return true for a valid rejection', () => {
    expect(isRejection(rejection)).toBe(true)
  })

  it('should return false for null', () => {
    expect(isRejection(null)).toBe(false)
  })

  it('should return false for a non-object', () => {
    expect(isRejection('string')).toBe(false)
  })

  it('should return false for a domain event', () => {
    expect(isRejection({
      id: randomUUID(),
      type: 'UserCreated',
      aggregateType: 'User',
      aggregateId: randomUUID(),
      payload: {},
      timestamp: Date.now(),
      metadata: {},
      kind: 'domain',
    })).toBe(false)
  })

  it('should return false when commandId is missing', () => {
    const { commandId: _, ...withoutCommandId } = rejection
    expect(isRejection(withoutCommandId)).toBe(false)
  })

  it('should return false when reasonCode is missing', () => {
    const { reasonCode: _, ...withoutReasonCode } = rejection
    expect(isRejection(withoutReasonCode)).toBe(false)
  })
})
