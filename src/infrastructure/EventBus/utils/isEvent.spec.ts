import type { BaseEvent } from '../Event'
import { isEvent } from './isEvent'

describe('isEvent util', () => {
  it('should be defined', () => {
    expect(isEvent).toBeDefined()
  })

  it('should confirm that the candidate is a event', () => {
    const event: BaseEvent = {
      version: 0,
      id: '123',
      type: 'TestEvent',
      payload: {},
      metadata: {
        source: 'internal',
        timestamp: new Date().toISOString(),
      },
    }
    expect(isEvent(event)).toBeTruthy()
  })

  it.each([
    { __scenario: 'CANDIDATE_IS_NOT_AN_OBJECT', input: 'test' },
    { __scenario: 'CANDIDATE_IS_NULL', input: null },
    {
      __scenario: 'CANDIDATE_IS_MISSING_TYPE',
      input: {
        version: 0,
        id: '123',
        payload: {},
        metadata: {
          source: 'internal',
          timestamp: new Date().toISOString(),
        },
      },
    },
    {
      __scenario: 'CANDIDATE_IS_MISSING_METADATA',
      input: {
        version: 0,
        type: 'TestEvent',
        id: '123',
        payload: {},
      },
    },
    {
      __scenario: 'CANDIDATE_METADATA_IS_NULL',
      input: {
        version: 0,
        type: 'TestEvent',
        id: '123',
        payload: {},
        metadata: null,
      },
    },
    {
      __scenario: 'CANDIDATE_METADATA_IS_NOT_AN_OBJECT',
      input: {
        version: 0,
        type: 'TestEvent',
        id: '123',
        payload: {},
        metadata: 'Test',
      },
    },
    {
      __scenario: 'CANDIDATE_METADATA_IS_NOT_AN_OBJECT',
      input: {
        version: 0,
        id: '123',
        type: 'TestEvent',
        payload: {},
        metadata: {
          timestamp: new Date().toISOString(),
        },
      },
    },
  ])('should confirm that the candidate is NOT an event ($__scenario)', ({ input }: { input: unknown }) => {
    expect(isEvent(input)).toBeFalsy()
  })
})
