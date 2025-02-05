import { Query, type QueryMetadata, type IQuery } from "../Query";

export interface MockQueryProps {
  name: string;
}

export interface MockQueryMetadata extends QueryMetadata {
  timestamp: Date
}

export class MockQuery extends Query<
  MockQueryProps,
  MockQueryMetadata
> implements IQuery { }
