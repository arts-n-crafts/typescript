import type { Specification } from '@domain/Specification/Specification.ts'

export interface DatabaseRecord {
  id: string
  [key: string]: unknown
}

export interface Database {
  query<TReturnType>(collectionName: string, specification: Specification): Promise<TReturnType>
  execute(tableName: string, statement: Statement): Promise<void>
}

export enum Operation {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface Statement {
  operation: Operation
  payload: object & { id: string }
}
