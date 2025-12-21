import type { Query } from '@core/Query.ts'
import { randomUUID } from 'node:crypto'
import { getTimestamp } from '@core/utils/getTimestamp.ts'
import { isQuery } from './isQuery.ts'

describe('isQuery util', () => {
  it('should be defined', () => {
    expect(isQuery).toBeDefined()
  })

  it('should confirm that the candidate is a query', () => {
    const query: Query = {
      id: randomUUID(),
      type: 'TestQuery',
      payload: {},
      kind: 'query',
      timestamp: getTimestamp(),
      metadata: {},
    }
    expect(isQuery(query)).toBeTruthy()
  })

  it.each([
    { __scenario: 'CANDIDATE_IS_NULL', input: null },
    { __scenario: 'CANDIDATE_IS_NOT_AN_OBJECT', input: 'test' },
    {
      __scenario: 'CANDIDATE_IS_MISSING_TYPE',
      input: {
        id: randomUUID(),
        payload: {},
        kind: 'query',
        timestamp: getTimestamp(),
        metadata: {},
      },
    },
    {
      __scenario: 'CANDIDATE_METADATA_KIND_IS_NOT_COMMAND',
      input: {
        id: randomUUID(),
        type: 'TestQuery',
        payload: {},
        kind: undefined,
        timestamp: getTimestamp(),
        metadata: {},
      },
    },
    {
      __scenario: 'CANDIDATE_IS_MISSING_METADATA_KIND',
      input: {
        id: randomUUID(),
        type: 'TestQuery',
        payload: {},
        metadata: {
          timestamp: getTimestamp(),
        },
      },
    },
    {
      __scenario: 'CANDIDATE_IS_MISSING_METADATA',
      input: {
        id: randomUUID(),
        type: 'TestQuery',
        payload: {},
      },
    },
    {
      __scenario: 'CANDIDATE_IS_MISSING_METADATA',
      input: {
        id: randomUUID(),
        type: 'TestQuery',
        payload: {},
        metadata: 'Test',
      },
    },
    {
      __scenario: 'CANDIDATE_IS_MISSING_METADATA',
      input: {
        id: randomUUID(),
        type: 'TestQuery',
        payload: {},
        metadata: null,
      },
    },
  ])('should confirm that the candidate is NOT a query ($__scenario)', ({ input }: { input: unknown }) => {
    expect(isQuery(input)).toBeFalsy()
  })
})
