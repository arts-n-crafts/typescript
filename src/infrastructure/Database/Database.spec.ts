import { randomUUID } from 'node:crypto'
import { FieldEquals } from '@domain/index.ts'
import { Operation } from './Database.ts'
import { DuplicateRecordException, OperationNotSupported, RecordNotFoundException } from './implementations/InMemoryDatabase.exceptions.ts'
import { InMemoryDatabase } from './implementations/InMemoryDatabase.ts'

describe('database', () => {
  const store = 'users'
  let database: InMemoryDatabase
  const user = { id: randomUUID(), name: 'John Doe' }
  let specification = new FieldEquals<typeof user>('name', user.name)

  beforeEach(async () => {
    database = new InMemoryDatabase()
    await database.execute(store, { operation: Operation.CREATE, payload: user })
  })

  it('should be defined', () => {
    expect(InMemoryDatabase).toBeDefined()
  })

  describe('create', () => {
    it('should have executed the CREATE statement', async () => {
      const query = database.query(store, specification)
      await expect(query).resolves.toEqual([user])
    })

    it('should throw an error if the id is already taken', async () => {
      const duplicateUser = { id: user.id, name: 'Jane Doe' }

      const statement = database.execute(store, { operation: Operation.CREATE, payload: duplicateUser })

      await expect(statement).rejects.toBeInstanceOf(DuplicateRecordException)
    })
  })

  describe('update', () => {
    it('should execute the UPDATE statement', async () => {
      const updatedUser = { id: user.id, name: 'Jane Doe' }
      specification = new FieldEquals<typeof user>('name', updatedUser.name)

      await database.execute(store, { operation: Operation.UPDATE, payload: updatedUser })
      const query = database.query(store, specification)
      await expect(query).resolves.toEqual([updatedUser])
    })

    it('should throw an error if the id cannot be found', async () => {
      const updatedUser = { id: 'non-existent-id', name: 'Jane Doe' }

      const statement = database.execute(store, { operation: Operation.UPDATE, payload: updatedUser })

      await expect(statement).rejects.toBeInstanceOf(RecordNotFoundException)
    })
  })

  describe('delete', () => {
    it('should executed the DELETE statement', async () => {
      await database.execute(store, { operation: Operation.DELETE, payload: user })

      const query = database.query(store, specification)
      await expect(query).resolves.toEqual([])
    })

    it('should throw an error if the id cannot be found', async () => {
      const deletedUser = { id: 'non-existent-id', name: 'Jane Doe' }

      const statement = database.execute(store, { operation: Operation.DELETE, payload: deletedUser })

      await expect(statement).rejects.toBeInstanceOf(RecordNotFoundException)
    })
  })

  describe('operation not supported', () => {
    it('should throw an error if the operation is not supported', async () => {
      const unsupportedOperation = { operation: 'unsupported' as Operation, payload: user }

      const statement = database.execute(store, unsupportedOperation)

      await expect(statement).rejects.toBeInstanceOf(OperationNotSupported)
    })
  })
})
