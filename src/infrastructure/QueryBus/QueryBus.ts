import type { Maybe } from "../../core/types/Maybe";
import type { CommandMetadata } from "../CommandBus/Command";
import type { Query } from "./Query";
import { type QueryHandler } from "./QueryHandler";

export interface QueryBus {
  register<TPayload, TResult>(
    query: new (payload: TPayload, metadata: Maybe<CommandMetadata>) => Query<TPayload>,
    handler: QueryHandler<Query<TPayload>, TResult>
  ): void;
  execute<TQuery, TResult>(query: TQuery): Promise<TResult>;
}
