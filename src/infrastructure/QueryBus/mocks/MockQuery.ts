import { Query } from "../Query";

export interface MockQueryProps {
  name: string;
}

export class MockQuery extends Query<MockQueryProps> { }
