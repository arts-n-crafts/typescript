import type { Repository } from "../Repository/Repository";
import { type IQuery, type Query } from "./Query";

export interface IQueryHandler {
  handle(query: Query<IQuery['payload'], IQuery['metadata']>): Promise<unknown>;
}

export abstract class QueryHandler<
  TQuery extends Query<IQuery['payload'], IQuery['metadata']>,
  TResult
> implements IQueryHandler {
  constructor(
    protected repository: Repository
  ) { }

  abstract handle(_query: TQuery): Promise<TResult>
}
