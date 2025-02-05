import type { IRepository } from "../Repository/Repository";
import { type IQuery, type Query } from "./Query";

export interface IQueryHandler {
  handle(query: Query<IQuery['payload'], IQuery['metadata']>): Promise<unknown>;
}

export abstract class QueryHandler<
  TQuery extends Query<IQuery['payload'], IQuery['metadata']>
> implements IQueryHandler {
  constructor(
    protected repository: IRepository
  ) { }

  handle(_query: Query<IQuery["payload"], IQuery["metadata"]>): Promise<unknown> {
    throw new Error("Method not implemented.");
  }

  abstract execute(command: TQuery): Promise<unknown>;
}
