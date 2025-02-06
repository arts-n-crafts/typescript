import { type IQuery, } from "./Query";
import { type QueryHandler } from "./QueryHandler";

export interface QueryBus {
  register<TQuery extends IQuery, TResult>(queryType: string, handler: QueryHandler<TQuery, TResult>): void;
  execute<TQuery extends IQuery, TResult>(query: TQuery): Promise<TResult>;
}
