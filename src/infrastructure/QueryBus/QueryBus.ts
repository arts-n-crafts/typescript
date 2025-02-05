import { type Query } from "./Query";
import { type QueryHandler } from "./QueryHandler";

export interface QueryBus {
  register<TQuery extends Query<TResult>, TResult>(queryType: string, handler: QueryHandler<TQuery, TResult>): void;
  execute<TQuery extends Query, TResult>(query: TQuery): Promise<TResult>;
}
