import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { MockUserByUsernameSpecification } from '../../domain/Specification/mocks/MockUserByUsernameSpecification'
import { Operation } from './Database'
import { DuplicateRecordException, OperationNotSupported, RecordNotFoundException, TableDoesNotExistException } from './Database.exceptions'
import { InMemoryDatabase } from './implementations/InMemoryDatabase'

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

  describe('sELECT', () => {
    it('should return TableDoesNotExistException if the table does not exist', async () => {
      const spec = new MockUserByUsernameSpecification(user.name)
      const query = database.query('nonexistent', spec)
      await expect(query).rejects.toBeInstanceOf(TableDoesNotExistException)
    })
  })

  describe('cREATE', () => {
    it('should have executed the CREATE statement', async () => {
      const spec = new MockUserByUsernameSpecification(user.name)

      const query = database.query(store, spec)
      await expect(query).resolves.toEqual([user])
    })

    it('should throw an error if the id is already taken', async () => {
      const duplicateUser = { id: user.id, name: 'Jane Doe' }

      const statement = database.execute(store, { operation: Operation.CREATE, payload: duplicateUser })

      await expect(statement).rejects.toBeInstanceOf(DuplicateRecordException)
    })
  })

  describe('uPDATE', () => {
    it('should execute the UPDATE statement', async () => {
      const updatedUser = { id: user.id, name: 'Jane Doe' }
      const spec = new MockUserByUsernameSpecification(updatedUser.name)

      await database.execute(store, { operation: Operation.UPDATE, payload: updatedUser })

      const query = database.query(store, spec)
      await expect(query).resolves.toEqual([updatedUser])
    })

    it('should throw an error if the id cannot be found', async () => {
      const updatedUser = { id: 'non-existent-id', name: 'Jane Doe' }

      const statement = database.execute(store, { operation: Operation.UPDATE, payload: updatedUser })

      await expect(statement).rejects.toBeInstanceOf(RecordNotFoundException)
    })
  })

  describe('dELETE', () => {
    it('should executed the DELETE statement', async () => {
      const spec = new MockUserByUsernameSpecification(user.name)

      await database.execute(store, { operation: Operation.DELETE, payload: user })

      const query = database.query(store, spec)
      await expect(query).resolves.toEqual([])
    })

    it('should throw an error if the id cannot be found', async () => {
      const deletedUser = { id: 'non-existent-id', name: 'Jane Doe' }

      const statement = database.execute(store, { operation: Operation.DELETE, payload: deletedUser })

      await expect(statement).rejects.toBeInstanceOf(RecordNotFoundException)
    })
  })

  describe('oPERATION NOT SUPPORTED', () => {
    it('should throw an error if the operation is not supported', async () => {
      const unsupportedOperation = { operation: 'unsupported' as Operation, payload: user }

      const statement = database.execute(store, unsupportedOperation)

      await expect(statement).rejects.toBeInstanceOf(OperationNotSupported)
    })
  })
})
