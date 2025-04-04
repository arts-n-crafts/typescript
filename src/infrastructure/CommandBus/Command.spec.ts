import type { UUID } from 'node:crypto'
import type { CommandMetadata } from './Command'
import type { UpdateUserNameCommandProps } from './examples/UpdateUserNameCommand'
import { randomUUID } from 'node:crypto'
import { Command } from './Command'
import { UpdateUserNameCommand } from './examples/UpdateUserNameCommand'

describe('command', () => {
  let aggregateId: UUID
  let payload: UpdateUserNameCommandProps
  let timestamp: Date
  let metadata: CommandMetadata

  beforeEach(() => {
    aggregateId = randomUUID()
    payload = { name: 'test' }
    timestamp = new Date()
    metadata = { timestamp }
  })

  it('should be defined', () => {
    expect(Command).toBeDefined()
  })

  it('should create an instance', () => {
    const command = new UpdateUserNameCommand(aggregateId, payload, metadata)
    expect(command).toBeInstanceOf(UpdateUserNameCommand)
  })

  it('should contain the valid information', () => {
    const command = new UpdateUserNameCommand(aggregateId, payload, metadata)
    expect(command.payload.name).toBe('test')
    expect(command.metadata?.timestamp).toBe(timestamp)
  })

  it('should have a type', () => {
    const command = new UpdateUserNameCommand(aggregateId, payload, metadata)
    expect(command.type).toBe('command')
  })
})
