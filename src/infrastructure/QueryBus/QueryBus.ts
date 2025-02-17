import type { Maybe } from "../../core/types/Maybe";
import type { CommandMetadata } from "../CommandBus/Command";
import type { Query } from "./Query";
import { type QueryHandler } from "./QueryHandler";

export interface IQueryBus {
  register<TPayload, TResult>(
    query: new (payload: TPayload, metadata: Maybe<CommandMetadata>) => Query<TPayload>,
    handler: QueryHandler<Query<TPayload>, TResult>
  ): void;
  execute(query: Query<unknown>): Promise<unknown>;
}

export class QueryBus implements IQueryBus {
  private handlers: Map<string, QueryHandler<Query<unknown>, unknown>> = new Map();

  register<TPayload, TResult>(
    _query: new (payload: TPayload, metadata: Maybe<CommandMetadata>) => Query<TPayload>,
    _handler: QueryHandler<Query<TPayload>, TResult>
  ): void {
    throw new Error("Method not implemented.");
  }

  async execute(query: Query<unknown>): Promise<unknown> {
    const handler = this.handlers.get(query.constructor.name)
    if (!handler) {
      throw new Error(`No handler found for query type: ${query.constructor.name}`);
    }
    throw new Error("Method not implemented.");
  }
}
