import type { IAggregateRoot } from "../../domain/AggregateRoot/AggregateRoot";
import type { Repository } from "../Repository/Repository";
import { type IQuery, } from "./Query";
import { type QueryHandler } from "./QueryHandler";

export interface QueryBus {
  register<TQuery extends IQuery, TResult>(queryType: string, handler: QueryHandler<Repository<IAggregateRoot<unknown>>, TQuery, TResult>): void;
  execute<TQuery extends IQuery, TResult>(query: TQuery): Promise<TResult>;
}
