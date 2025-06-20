export interface Database {
  query: <T>(tableName: string, query: Record<string, string>[]) => Promise<T[]>
  execute: (tableName: string, statement: Statement) => Promise<void>
}

export interface DatabaseRecord {
  id: string
}

export enum Operation {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface Statement {
  operation: Operation
  payload: DatabaseRecord
}
