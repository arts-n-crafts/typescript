import { QueryHandler } from "../QueryHandler";
import type { MockGetUserByEmailQuery } from "./MockGetUserByEmailQuery";

export class MockGetUserByEmailQueryHandler extends QueryHandler<MockGetUserByEmailQuery, unknown> {
  async execute(query: MockGetUserByEmailQuery) {
    const _aggregateId = '123'
    const _eventPayload = { name: query.payload.email }
  }
}
