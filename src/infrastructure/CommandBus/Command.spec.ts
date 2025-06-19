import type { UUID } from 'node:crypto'
import type { Command, CommandMetadata } from './Command'
import type { UpdateUserNameProps } from './examples/UpdateUserName'
import { randomUUID } from 'node:crypto'
import { UpdateUserName } from './examples/UpdateUserName'

describe('command', () => {
  let aggregateId: UUID
  let payload: UpdateUserNameProps
  let metadata: CommandMetadata
  let command: Command<string, unknown>

  beforeEach(() => {
    aggregateId = randomUUID()
    payload = { name: 'test' }
    metadata = { causationId: randomUUID() }
    command = UpdateUserName(aggregateId, payload, metadata)
  })

  it('should be defined', () => {
    expect(command).toBeDefined()
  })

  it('should create the command object', () => {
    expect(command.type).toBe('UpdateUserName')
  })

  it('should contain the valid information', () => {
    const command = UpdateUserName(aggregateId, payload, metadata)
    expect(command.payload.name).toBe('test')
    expect(command.metadata?.causationId).toBe(metadata.causationId)
    expect(command.metadata.timestamp).toBeDefined()
  })

  it('should have a kind', () => {
    const command = UpdateUserName(aggregateId, payload, metadata)
    expect(command.kind).toBe('command')
  })
})
