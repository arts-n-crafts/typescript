import type { CompositeSpecification } from '@domain/Specification/Specification.ts'
import type { WithIdentifier } from '../../core/types/WithIdentifier.ts'

export enum Operation {
  CREATE = 'CREATE',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
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
  payload: WithIdentifier<Partial<TModel>>
}

export interface DeleteStatement extends Statement<WithIdentifier> {
  operation: Operation.DELETE
  payload: WithIdentifier
}

interface Executable<TModel, TReturnType = Promise<void>> {
  execute(tableName: string, statement: CreateStatement<TModel>): TReturnType
  execute(tableName: string, statement: PutStatement<TModel>): TReturnType
  execute(tableName: string, statement: PatchStatement<TModel>): TReturnType
  execute(tableName: string, statement: DeleteStatement): TReturnType
}

interface QueryAble<TModel, TReturnType = Promise<TModel[]>> {
  query(collectionName: string, specification: CompositeSpecification<TModel>): TReturnType
}

export interface Database<TModel, TExecuteReturnType = Promise<void>, TQueryReturnType = Promise<TModel[]>>
  extends
  QueryAble<TModel, TQueryReturnType>,
  Executable<TModel, TExecuteReturnType> { }
