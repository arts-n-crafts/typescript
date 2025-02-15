import type { Database } from "../Database/Database";
import { Query } from "./Query";

export abstract class QueryHandler<TQuery extends Query, TResult>  {
  constructor(
    protected database: Database
  ) { }

  abstract execute(command: TQuery): Promise<TResult>;
}
