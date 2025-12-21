import type { Command } from '@core/Command.ts'
import { randomUUID } from 'node:crypto'
import { isCommand } from './isCommand.ts'

describe('isCommand util', () => {
  it('should be defined', () => {
    expect(isCommand).toBeDefined()
  })

  it('should confirm that the candidate is a command', () => {
    const command: Command<string, unknown> = {
      id: randomUUID(),
      type: 'TestCommand',
      aggregateId: '123',
      payload: { foo: 'bar' },
      kind: 'command',
      timestamp: Math.floor(new Date().getTime() / 1000),
      metadata: {
      },
    }
    expect(isCommand(command)).toBeTruthy()
  })

  it.each([
    { __scenario: 'CANDIDATE_IS_NULL', input: null },
    { __scenario: 'CANDIDATE_IS_NOT_AN_OBJECT', input: 'test' },
    {
      __scenario: 'CANDIDATE_IS_MISSING_TYPE',
      input: {
        id: randomUUID(),
        aggregateId: '123',
        payload: {},
        kind: 'command',
        timestamp: Math.floor(new Date().getTime() / 1000),
        metadata: {
        },
      },
    },
    {
      __scenario: 'CANDIDATE_METADATA_KIND_IS_NOT_COMMAND',
      input: {
        id: randomUUID(),
        type: 'TestCommand',
        aggregateId: '123',
        payload: {},
        kind: undefined,
        timestamp: Math.floor(new Date().getTime() / 1000),
        metadata: {
        },
      },
    },
    {
      __scenario: 'CANDIDATE_IS_MISSING_METADATA_KIND',
      input: {
        id: randomUUID(),
        type: 'TestCommand',
        aggregateId: '123',
        payload: {},
        timestamp: Math.floor(new Date().getTime() / 1000),
        metadata: {
        },
      },
    },
    {
      __scenario: 'CANDIDATE_IS_MISSING_METADATA',
      input: {
        id: randomUUID(),
        type: 'TestCommand',
        aggregateId: '123',
        payload: {},
      },
    },
    {
      __scenario: 'CANDIDATE_IS_MISSING_METADATA',
      input: {
        id: randomUUID(),
        type: 'TestCommand',
        aggregateId: '123',
        payload: {},
        metadata: 'Test',
      },
    },
    {
      __scenario: 'CANDIDATE_IS_MISSING_METADATA',
      input: {
        id: randomUUID(),
        type: 'TestCommand',
        aggregateId: '123',
        payload: {},
        metadata: null,
      },
    },
  ])('should confirm that the candidate is NOT a command ($__scenario)', ({ input }: { input: unknown }) => {
    expect(isCommand(input)).toBeFalsy()
  })
})
