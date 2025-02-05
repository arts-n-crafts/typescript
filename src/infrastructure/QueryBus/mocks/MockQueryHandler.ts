import { MockDomainEvent } from "../../../domain/DomainEvent/mocks/MockDomainEvent";
import { QueryHandler } from "../QueryHandler";
import type { MockQuery } from "./MockQuery";

export class MockQueryHandler extends QueryHandler<MockQuery> {
  async execute(query: MockQuery) {
    const aggregateId = '123'
    const eventPayload = { name: query.payload.name }
    const eventMetadata = {
      causationId: '321',
      timestamp: new Date()
    }
    const event = new MockDomainEvent(
      aggregateId, eventPayload, eventMetadata
    )
    this.eventStore.store(event)
  }
}
