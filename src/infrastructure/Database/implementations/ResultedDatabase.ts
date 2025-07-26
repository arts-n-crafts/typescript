import type { Specification } from '@domain/Specification/Specification.ts'
import type { Result } from 'oxide.ts'
import type { CreateStatement, Database, DeleteStatement, PatchStatement, PutStatement, WithIdentifier } from '../Database.ts'
import { Err, Ok } from 'oxide.ts'
import { Operation } from '../Database.ts'
import { DatabaseOfflineException, DuplicateRecordException, RecordNotFoundException } from './SimpleDatabase.exceptions.ts'

export type ResultedDatabaseExecuteReturnType = Result<{ id: string }, Error>

export class ResultedDatabase<TModels extends WithIdentifier> implements Database<TModels, ResultedDatabaseExecuteReturnType, Result<TModels[], Error>> {
  private readonly datasource = new Map<string, TModels[]>()
  private simulateOffline = false

  async query(
    tableName: string,
    specification: Specification<TModels>,
  ): Promise<Result<TModels[], Error>> {
    if (this.simulateOffline)
      return Err(new DatabaseOfflineException())

    const tableRecords = (this.datasource.get(tableName) || [])
    return Ok(tableRecords
      .filter((record: TModels) => specification.isSatisfiedBy(record)))
  }

  async execute(
    tableName: string,
    statement: CreateStatement<TModels> | PutStatement<TModels> | PatchStatement<TModels> | DeleteStatement,
  ): Promise<ResultedDatabaseExecuteReturnType> {
    if (this.simulateOffline)
      return Err(new DatabaseOfflineException())

    if (!this.datasource.has(tableName))
      this.datasource.set(tableName, [])
    const table = this.datasource.get(tableName)!

    switch (statement.operation) {
      case Operation.CREATE: {
        const isDuplicate = table.some(item => item.id === statement.payload.id)
        if (isDuplicate)
          return Err(new DuplicateRecordException(statement.payload.id))
        table.push(statement.payload)
        return Ok({ id: statement.payload.id })
      }
      case Operation.PUT:{
        const index = table.findIndex(item => item.id === statement.payload.id)
        if (index === -1)
          return Err(new RecordNotFoundException(statement.payload.id))
        table[index] = statement.payload
        return Ok({ id: statement.payload.id })
      }
      case Operation.PATCH:{
        const index = table.findIndex(item => item.id === statement.payload.id)
        if (index === -1)
          return Err(new RecordNotFoundException(statement.payload.id))
        table[index] = { ...table[index], ...statement.payload }
        return Ok({ id: statement.payload.id })
      }
      case Operation.DELETE:{
        const index = table.findIndex(item => item.id === statement.payload.id)
        if (index === -1)
          return Err(new RecordNotFoundException(statement.payload.id))
        table.splice(index, 1)
        return Ok({ id: statement.payload.id })
      }
    }
  }

  goOffline(): void {
    this.simulateOffline = true
  }
}
