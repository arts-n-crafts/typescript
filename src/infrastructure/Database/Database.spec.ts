import { randomUUID } from 'node:crypto'
import { Operation } from './Database.ts'
import { DuplicateRecordException, OperationNotSupported, RecordNotFoundException, TableDoesNotExistException } from './implementations/InMemoryDatabase.exceptions.ts'
import { InMemoryDatabase } from './implementations/InMemoryDatabase.ts'

describe('database', () => {
  const store = 'users'
  let database: InMemoryDatabase
  let user: { id: string, name: string }

  beforeEach(async () => {
    database = new InMemoryDatabase()
    user = { id: randomUUID(), name: 'John Doe' }
    await database.execute(store, { operation: Operation.CREATE, payload: user })
  })

  it('should be defined', () => {
    expect(InMemoryDatabase).toBeDefined()
  })

  describe('select', () => {
    it('should return TableDoesNotExistException if the table does not exist', async () => {
      const query = database.query('nonexistent', [{ name: user.name }])
      await expect(query).rejects.toBeInstanceOf(TableDoesNotExistException)
    })
  })

  describe('create', () => {
    it('should have executed the CREATE statement', async () => {
      const query = database.query(store, [{ name: user.name }])
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
      await database.execute(store, { operation: Operation.UPDATE, payload: updatedUser })
      const query = database.query(store, [{ name: updatedUser.name }])
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

      const query = database.query(store, [{ name: user.name }])
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
