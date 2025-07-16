import type { Specification } from '@domain/Specification/Specification.ts'
import type { Database, DatabaseRecord, Statement } from '../Database.ts'
import { Operation } from '../Database.ts'
import { DuplicateRecordException, OperationNotSupported, RecordNotFoundException } from './InMemoryDatabase.exceptions.ts'

export class InMemoryDatabase implements Database {
  private readonly datasource = new Map<string, DatabaseRecord[]>()

  async query<T = DatabaseRecord>(tableName: string, specification: Specification<T>): Promise<T[]> {
    const tableRecords = this.datasource.get(tableName) || []
    return tableRecords
      .filter((record: DatabaseRecord) => specification.isSatisfiedBy(record as T)) as T[]
  }

  async execute(tableName: string, statement: Statement): Promise<void> {
    if (!this.datasource.has(tableName))
      this.datasource.set(tableName, [])
    const table = this.datasource.get(tableName)!

    if (statement.operation === Operation.CREATE) {
      const isDuplicate = table.some(item => item.id === statement.payload.id)
      if (isDuplicate)
        throw new DuplicateRecordException(statement.payload.id)
      table.push(statement.payload)
      return
    }
    if (statement.operation === Operation.UPDATE) {
      const index = table.findIndex(item => item.id === statement.payload.id)
      if (index === -1)
        throw new RecordNotFoundException(statement.payload.id)
      table[index] = { ...table[index], ...statement.payload }
      return
    }
    if (statement.operation === Operation.DELETE) {
      const index = table.findIndex(item => item === statement.payload)
      if (index === -1)
        throw new RecordNotFoundException(statement.payload.id)
      table.splice(index, 1)
      return
    }

    throw new OperationNotSupported(statement.operation)
  }
}
