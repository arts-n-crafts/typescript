import { Query } from "../Query";

export interface MockGetUserByEmailQueryProps {
  aggregateId: string;
  email: string;
}

export class MockGetUserByEmailQuery extends Query<MockGetUserByEmailQueryProps> { }
