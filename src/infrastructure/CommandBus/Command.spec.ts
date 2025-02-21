import type { CommandMetadata } from './Command'
import type { MockUpdateUserNameCommandProps } from './mocks/MockUpdateUserNameCommand'
import { beforeEach, describe, expect, it } from 'vitest'
import { Command } from './Command'
import { MockUpdateUserNameCommand } from './mocks/MockUpdateUserNameCommand'

describe('command', () => {
  let payload: MockUpdateUserNameCommandProps
  let timestamp: Date
  let metadata: CommandMetadata

  beforeEach(() => {
    payload = { aggregateId: '123', name: 'test' }
    timestamp = new Date()
    metadata = { timestamp }
  })

  it('should be defined', () => {
    expect(Command).toBeDefined()
  })

  it('should create an instance', () => {
    const command = new MockUpdateUserNameCommand(payload, metadata)
    expect(command).toBeInstanceOf(MockUpdateUserNameCommand)
  })

  it('should contain the valid information', () => {
    const command = new MockUpdateUserNameCommand(payload, metadata)
    expect(command.payload.name).toBe('test')
    expect(command.metadata?.timestamp).toBe(timestamp)
  })
})
