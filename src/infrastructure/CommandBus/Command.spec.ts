import type { CommandMetadata } from './Command'
import type { UpdateUserNameCommandProps } from './examples/UpdateUserNameCommand'
import { beforeEach, describe, expect, it } from 'vitest'
import { Command } from './Command'
import { UpdateUserNameCommand } from './examples/UpdateUserNameCommand'

describe('command', () => {
  let payload: UpdateUserNameCommandProps
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
    const command = new UpdateUserNameCommand(payload, metadata)
    expect(command).toBeInstanceOf(UpdateUserNameCommand)
  })

  it('should contain the valid information', () => {
    const command = new UpdateUserNameCommand(payload, metadata)
    expect(command.payload.name).toBe('test')
    expect(command.metadata?.timestamp).toBe(timestamp)
  })

  it('should have a type', () => {
    const command = new UpdateUserNameCommand(payload, metadata)
    expect(command.type).toBe('command')
  })
})
