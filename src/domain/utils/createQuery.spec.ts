/* eslint ts/no-unsafe-assignment: 0 */ // expect.objectContaining has any type, unfortunately

import { createQuery } from './createQuery.ts'

describe('createQuery util', () => {
  it('should be defined', () => {
    expect(createQuery).toBeDefined()
  })

  it('should create an query-like object', () => {
    const query = createQuery('testQuery', { value: 'test' }, {})
    expect(query).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
        metadata: expect.objectContaining({
          timestamp: expect.any(String),
          kind: 'query',
        }),
        payload: {
          value: 'test',
        },
        type: 'testQuery',
      }),
    )
  })
})
