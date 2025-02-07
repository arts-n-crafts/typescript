import { MockUserNameUpdatedEvent } from "../../../domain/DomainEvent/mocks/MockUserNameUpdated";
import type { MockUserRepository } from "../../Repository/mocks/MockRepository";
import { QueryHandler } from "../QueryHandler";
import type { MockQuery } from "./MockQuery";

export class MockQueryHandler extends QueryHandler<MockUserRepository, MockQuery, unknown> {
  async handle(query: MockQuery) {
    const aggregateId = '123'
    const eventPayload = { name: query.payload.name }
    const eventMetadata = {
      causationId: '321',
      timestamp: new Date()
    }
    const event = new MockUserNameUpdatedEvent( aggregateId, eventPayload )
    event.applyMetadata(eventMetadata);
    // this.repository.store(event)
  }
}
