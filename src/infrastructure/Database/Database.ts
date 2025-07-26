import type { Specification } from '@domain/Specification/Specification.ts'

export enum Operation {
  CREATE = 'CREATE',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface WithIdentifier {
  id: string
}

interface Statement<TModel> {
  operation: Operation
  payload: TModel
}

export interface CreateStatement<TModel> extends Statement<TModel> {
  operation: Operation.CREATE
  payload: TModel
}

export interface PutStatement<TModel> extends Statement<TModel> {
  operation: Operation.PUT
  payload: TModel
}

export interface PatchStatement<TModel> extends Statement<Partial<TModel>> {
  operation: Operation.PATCH
  payload: Partial<TModel> & WithIdentifier
}

export interface DeleteStatement extends Statement<WithIdentifier> {
  operation: Operation.DELETE
  payload: WithIdentifier
}

interface Executable<TModel, TReturnType> {
  execute(tableName: string, statement: CreateStatement<TModel>): Promise<TReturnType>
  execute(tableName: string, statement: PutStatement<TModel>): Promise<TReturnType>
  execute(tableName: string, statement: PatchStatement<TModel>): Promise<TReturnType>
  execute(tableName: string, statement: DeleteStatement): Promise<TReturnType>
}

interface QueryAble<TModel, TReturnType = TModel[]> {
  query(collectionName: string, specification: Specification<TModel>): Promise<TReturnType>
}

export interface Database<TModel, TExecuteReturnType, TQueryReturnType = TModel[]>
  extends
  QueryAble<TModel, TQueryReturnType>,
  Executable<TModel, TExecuteReturnType> { }
