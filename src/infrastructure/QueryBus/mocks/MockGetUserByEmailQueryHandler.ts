import { MockUserByEmailSpecification } from "../../../domain/Specification/mocks/MockUserByEmailSpecification";
import { QueryHandler } from "../QueryHandler";
import type { MockGetUserByEmailQuery } from "./MockGetUserByEmailQuery";

export class MockGetUserByEmailQueryHandler extends QueryHandler<MockGetUserByEmailQuery, unknown> {
  async execute(query: MockGetUserByEmailQuery) {
    const specification = new MockUserByEmailSpecification(query.payload.email);
    this.database.query('users', specification);
  }
}
