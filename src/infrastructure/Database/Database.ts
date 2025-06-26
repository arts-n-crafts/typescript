export interface DatabaseRecord {
  id: string
}

export interface Database {
  query: <T extends DatabaseRecord>(tableName: string, query: Partial<T>[]) => Promise<T[]>
  execute: (tableName: string, statement: Statement) => Promise<void>
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
