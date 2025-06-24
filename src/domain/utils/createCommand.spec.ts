/* eslint ts/no-unsafe-assignment: 0 */ // expect.objectContaining has any type, unfortunately

import { randomUUID } from 'node:crypto'
import { createCommand } from './createCommand'

describe('createCommand util', () => {
  it('should be defined', () => {
    expect(createCommand).toBeDefined()
  })

  it('should create an command-like object', () => {
    const aggregateId = randomUUID()
    const command = createCommand('testCommand', aggregateId, { value: 'test' }, {})
    expect(command).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
        aggregateId,
        kind: 'command',
        metadata: expect.objectContaining({
          timestamp: expect.any(String),
        }),
        payload: {
          value: 'test',
        },
        type: 'testCommand',
      }),
    )
  })
})
