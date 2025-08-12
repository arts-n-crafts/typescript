import type { Specification } from '@domain/Specification/Specification.ts'
import type { WithIdentifier } from '../../../core/types/WithIdentifier.ts'
import type { CreateStatement, Database, DeleteStatement, PatchStatement, PutStatement } from '../Database.ts'
import { Operation } from '../Database.ts'
import { DatabaseOfflineException, DuplicateRecordException, RecordNotFoundException } from './SimpleDatabase.exceptions.ts'

export class SimpleDatabase<TModel extends WithIdentifier> implements Database<TModel> {
  private readonly datasource = new Map<string, TModel[]>()
  private simulateOffline = false

  async query(
    tableName: string,
    specification: Specification<TModel>,
  ): Promise<TModel[]> {
    if (this.simulateOffline)
      throw new DatabaseOfflineException()

    const tableRecords = (this.datasource.get(tableName) || [])
    return tableRecords
      .filter((record: TModel) => specification.isSatisfiedBy(record))
  }

  async execute(
    tableName: string,
    statement: CreateStatement<TModel> | PutStatement<TModel> | PatchStatement<TModel> | DeleteStatement,
  ): Promise<void> {
    if (this.simulateOffline)
      throw new DatabaseOfflineException()

    if (!this.datasource.has(tableName))
      this.datasource.set(tableName, [])
    const table = this.datasource.get(tableName)!

    switch (statement.operation) {
      case Operation.CREATE: {
        const isDuplicate = table.some(item => item.id === statement.payload.id)
        if (isDuplicate)
          throw new DuplicateRecordException(statement.payload.id)
        table.push(statement.payload)
        break
      }
      case Operation.PUT:{
        const index = table.findIndex(item => item.id === statement.payload.id)
        if (index === -1)
          throw new RecordNotFoundException(statement.payload.id)
        table[index] = statement.payload
        break
      }
      case Operation.PATCH:{
        const index = table.findIndex(item => item.id === statement.payload.id)
        if (index === -1)
          throw new RecordNotFoundException(statement.payload.id)
        table[index] = { ...table[index], ...statement.payload }
        break
      }
      case Operation.DELETE:{
        const index = table.findIndex(item => item.id === statement.payload.id)
        if (index === -1)
          throw new RecordNotFoundException(statement.payload.id)
        table.splice(index, 1)
        break
      }
    }
  }

  goOffline(): void {
    this.simulateOffline = true
  }
}
