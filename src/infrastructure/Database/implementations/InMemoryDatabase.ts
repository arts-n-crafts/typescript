import type { Database, DatabaseRecord, Statement } from '../Database'
import { Operation } from '../Database'
import { DuplicateRecordException, OperationNotSupported, RecordNotFoundException, TableDoesNotExistException } from './InMemoryDatabase.exceptions'

export class InMemoryDatabase implements Database {
  private readonly datasource = new Map<string, DatabaseRecord[]>()

  async query<T>(tableName: string, spec: Record<string, string>[]): Promise<T[]> {
    const data = this.datasource.get(tableName)
    if (!data)
      throw new TableDoesNotExistException(`Table ${tableName.toString()} not found`)

    const entry = spec[0]
    const [key, value] = Object.entries(entry).flat()

    return data.filter((record: DatabaseRecord) => {
      return record[key as keyof typeof record] === value
    }) as T[]
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
