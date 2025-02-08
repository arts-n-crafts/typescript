import { describe, it, expect, beforeEach } from "vitest";
import { MockUpdateUserNameCommandHandler } from "./mocks/MockUpdateUserNameCommandHandler";
import type { EventStore } from "../EventStore/EventStore";
import { MockUpdateUserNameCommand } from "./mocks/MockUpdateUserNameCommand";
import { MockUserRepository } from "../Repository/mocks/MockUserRepository";
import { InMemoryEventStore } from "../EventStore/implementations/InMemoryEventStore";
import type { Repository } from "../Repository/Repository";
import type { AggregateRoot } from "../../domain/AggregateRoot/AggregateRoot";

describe('CommandHandler', () => {
  let eventStore: EventStore;
  let repository: Repository<AggregateRoot<unknown>>
  let handler: MockUpdateUserNameCommandHandler;

  beforeEach(() => {
    eventStore = new InMemoryEventStore();
    repository = new MockUserRepository(eventStore);
    handler = new MockUpdateUserNameCommandHandler(repository);
  })

  it('should be defined', () => {
    expect(MockUpdateUserNameCommandHandler).toBeDefined();
  });
  
  

  it.skip('should process the command and return an event', async () => {
    const command: MockUpdateUserNameCommand = new MockUpdateUserNameCommand(
      { name: 'test' },
      { timestamp: new Date() }
    );
    handler.execute(command)
    const events = await eventStore.loadEvents('123');
    expect(events).toHaveLength(1);
    expect(events[0].metadata?.causationId).toBe('321');
  })
});
