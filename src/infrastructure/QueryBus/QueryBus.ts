import type { Maybe } from "../../core/types/Maybe";
import type { CommandMetadata } from "../CommandBus/Command";
import type { Query } from "./Query";
import { type QueryHandler } from "./QueryHandler";

export interface IQueryBus {
  register<TPayload, TResult>(
    query: new (payload: TPayload, metadata: Maybe<CommandMetadata>) => Query<TPayload>,
    handler: QueryHandler<Query<TPayload>, TResult>
  ): void;
  execute<TQuery, TResult>(query: TQuery): Promise<TResult>;
}

export class QueryBus implements IQueryBus {
  register<TPayload, TResult>(
    _query: new (payload: TPayload, metadata: Maybe<CommandMetadata>) => Query<TPayload>, 
    _handler: QueryHandler<Query<TPayload>, TResult>
  ): void {
    throw new Error("Method not implemented.");
  }
  execute<TQuery, TResult>(_query: TQuery): Promise<TResult> {
    throw new Error("Method not implemented.");
  }
}
