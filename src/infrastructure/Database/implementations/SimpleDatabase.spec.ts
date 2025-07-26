import type { UserState } from '@domain/examples/User.ts'
import type { CreateStatement, Database, DeleteStatement, PatchStatement, PutStatement } from '../Database.ts'
import type { SimpleDatabaseResult } from './SimpleDatabase.ts'
import { randomUUID } from 'node:crypto'
import { FieldEquals } from '@domain/index.ts'
import { Operation } from '../Database.ts'
import { DatabaseOfflineException, DuplicateRecordException, RecordNotFoundException } from './SimpleDatabase.exceptions.ts'
import { SimpleDatabase } from './SimpleDatabase.ts'

describe('simple database', () => {
  const tableName = 'users'
  let database: Database<UserState, SimpleDatabaseResult>
  const createStatement: CreateStatement<UserState> = {
    operation: Operation.CREATE,
    payload: {
      id: randomUUID(),
      name: 'John Doe',
      email: 'john.doe@example.com',
      prospect: true,
    },
  }
  const specification = new FieldEquals('id', createStatement.payload.id)

  beforeEach(() => {
    database = new SimpleDatabase()
  })

  it('should be defined', () => {
    expect(SimpleDatabase).toBeDefined()
  })

  it('should execute a Operation.CREATE statement', async () => {
    const result = await database.execute(tableName, createStatement)
    expect(result).toBeUndefined()
  })

  it('should be able to query for Users', async () => {
    await database.execute(tableName, createStatement)
    const result = await database.query(tableName, specification)
    expect(result).toStrictEqual([createStatement.payload])
  })

  it('should execute a Operation.PUT statement', async () => {
    await database.execute(tableName, createStatement)
    const currentState = await database.query(tableName, specification)

    const statement: PutStatement<UserState> = {
      operation: Operation.PUT,
      payload: {
        ...currentState[0],
        prospect: true,
      },
    }
    await database.execute(tableName, statement)
    const newState = await database.query(tableName, specification)
    expect(newState).toStrictEqual([statement.payload])
  })

  it('should execute a Operation.PATCH statement', async () => {
    await database.execute(tableName, createStatement)

    const statement: PatchStatement<UserState> = {
      operation: Operation.PATCH,
      payload: {
        id: createStatement.payload.id,
        prospect: true,
      },
    }
    await database.execute(tableName, statement)
    const newState = await database.query(tableName, specification)
    expect(newState[0]).not.toBe(createStatement.payload)
    expect(newState[0].prospect).toBe(true)
    expect(newState[0].id).toBe(createStatement.payload.id)
  })

  it('should execute a Operation.DELETE statement', async () => {
    await database.execute(tableName, createStatement)
    const statement: DeleteStatement = {
      operation: Operation.DELETE,
      payload: {
        id: createStatement.payload.id,
      },
    }
    await database.execute(tableName, statement)
    const records = await database.query(tableName, specification)
    expect(records).toHaveLength(0)
  })

  describe('exceptions', () => {
    it('should throw DuplicateRecordException, on create', async () => {
      await database.execute(tableName, createStatement)
      await expect(database.execute(tableName, createStatement)).rejects.toThrow(DuplicateRecordException)
    })
    it('should throw RecordNotFoundException, on put', async () => {
      const statement: PutStatement<UserState> = {
        operation: Operation.PUT,
        payload: {
          ...createStatement.payload,
          prospect: true,
        },
      }
      await expect(database.execute(tableName, statement)).rejects.toThrow(RecordNotFoundException)
    })
    it('should throw RecordNotFoundException, on patch', async () => {
      const statement: PatchStatement<UserState> = {
        operation: Operation.PATCH,
        payload: {
          id: createStatement.payload.id,
          prospect: true,
        },
      }
      await expect(database.execute(tableName, statement)).rejects.toThrow(RecordNotFoundException)
    })
    it('should throw RecordNotFoundException, on delete', async () => {
      const statement: DeleteStatement = {
        operation: Operation.DELETE,
        payload: {
          id: createStatement.payload.id,
        },
      }
      await expect(database.execute(tableName, statement)).rejects.toThrow(RecordNotFoundException)
    })

    describe('offline mode', () => {
      const db = new SimpleDatabase()
      db.goOffline()

      it('should throw DatabaseOfflineException when performing a query', async () => {
        await expect(db.query(tableName, specification)).rejects.toThrow(DatabaseOfflineException)
      })
      it('should throw DatabaseOfflineException when performing an operation', async () => {
        await expect(db.execute(tableName, createStatement)).rejects.toThrow(DatabaseOfflineException)
      })
    })
  })
})
