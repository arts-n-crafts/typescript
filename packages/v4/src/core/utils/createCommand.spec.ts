/* eslint ts/no-unsafe-assignment: 0 */ // expect.objectContaining has any type, unfortunately
import { randomUUID } from 'node:crypto'
import { createCommand } from '@core/utils/createCommand.ts'

describe('createCommand util', () => {
  it('should be defined', () => {
    expect(createCommand).toBeDefined()
  })

  it('should create an command-like object', () => {
    const aggregateId = randomUUID()
    const command = createCommand('testCommand', aggregateId, 'User', { value: 'test' }, {})
    expect(command).toStrictEqual(
      expect.objectContaining({
        id: expect.any(String),
        aggregateId,
        kind: 'command',
        timestamp: expect.any(Number),
        metadata: expect.objectContaining({}),
        payload: {
          value: 'test',
        },
        type: 'testCommand',
      }),
    )
  })
})
