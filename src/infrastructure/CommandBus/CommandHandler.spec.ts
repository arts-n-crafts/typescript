import { describe, it, expect, beforeEach } from "vitest";
import { MockUpdateUserNameCommandHandler } from "./mocks/MockUpdateUserNameCommandHandler";
import type { EventStore } from "../EventStore/EventStore";
import { InMemoryEventStore } from "../EventStore/implementations/InMemoryEventStore";
import { MockUpdateUserNameCommand } from "./mocks/MockUpdateUserNameCommand";

describe('CommandHandler', () => {
  let eventStore: EventStore;
  let handler: MockUpdateUserNameCommandHandler;

  beforeEach(() => {
    eventStore = new InMemoryEventStore();
    handler = new MockUpdateUserNameCommandHandler(eventStore);
  })

  it('should be defined', () => {
    expect(MockUpdateUserNameCommandHandler).toBeDefined();
  });

  it('should process the command and return an event', async () => {
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
