import type { DomainEvent } from '../DomainEvent.ts'
import { isEvent } from './isEvent.ts'

describe('isEvent util', () => {
  it('should be defined', () => {
    expect(isEvent).toBeDefined()
  })

  it('should confirm that the candidate is a event', () => {
    const event: DomainEvent<Record<string, unknown>> = {
      id: '123',
      aggregateId: '456',
      type: 'TestEvent',
      payload: {},
      source: 'internal',
      timestamp: Math.floor(new Date().getTime() / 1000),
      metadata: {},
    }
    expect(isEvent(event)).toBeTruthy()
  })

  it.each([
    { __scenario: 'CANDIDATE_IS_NOT_AN_OBJECT', input: 'test' },
    { __scenario: 'CANDIDATE_IS_NULL', input: null },
    {
      __scenario: 'CANDIDATE_IS_MISSING_TYPE',
      input: {
        id: '123',
        payload: {},
        source: 'internal',
        timestamp: Math.floor(new Date().getTime() / 1000),
        metadata: {},
      },
    },
    {
      __scenario: 'CANDIDATE_IS_MISSING_METADATA',
      input: {
        type: 'TestEvent',
        id: '123',
        payload: {},
      },
    },
    {
      __scenario: 'CANDIDATE_METADATA_IS_NULL',
      input: {
        type: 'TestEvent',
        id: '123',
        payload: {},
        metadata: null,
      },
    },
    {
      __scenario: 'CANDIDATE_METADATA_IS_NOT_AN_OBJECT',
      input: {
        type: 'TestEvent',
        id: '123',
        payload: {},
        metadata: 'Test',
      },
    },
    {
      __scenario: 'CANDIDATE_METADATA_IS_NOT_AN_OBJECT',
      input: {
        id: '123',
        type: 'TestEvent',
        payload: {},
        timestamp: Math.floor(new Date().getTime() / 1000),
        metadata: {},
      },
    },
  ])('should confirm that the candidate is NOT an event ($__scenario)', ({ input }: { input: unknown }) => {
    expect(isEvent(input)).toBeFalsy()
  })
})
