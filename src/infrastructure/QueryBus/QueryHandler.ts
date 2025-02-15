import { AggregateRoot } from "../../domain/AggregateRoot/AggregateRoot";
import type { Repository } from "../Repository/Repository";
import { Query } from "./Query";

export abstract class QueryHandler<
  TQuery extends Query<unknown>,
  TResult> 
{
  constructor(
    protected repository: Repository<AggregateRoot<unknown>>
  ) { }

  abstract execute(command: TQuery): Promise<TResult>;
}
