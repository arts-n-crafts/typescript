import { describe, it, expect, beforeEach } from "vitest";
import { MockCommandHandler } from "./mocks/MockCommandHandler";
import type { EventStore } from "../EventStore/EventStore";
import { InMemoryEventStore } from "../EventStore/implementations/InMemoryEventStore";
import { MockCommand } from "./mocks/MockCommand";

describe('CommandHandler', () => {
  let eventStore: EventStore;
  let handler: MockCommandHandler;

  beforeEach(() => {
    eventStore = new InMemoryEventStore();
    handler = new MockCommandHandler(eventStore);
  })

  it('should be defined', () => {
    expect(MockCommandHandler).toBeDefined();
  });

  it('should process the command and return an event', async () => {
    const command: MockCommand = new MockCommand(
      { name: 'test' },
      { timestamp: new Date() }
    );
    handler.execute(command)
    const events = await eventStore.loadEvents('123');
    expect(events).toHaveLength(1);
    expect(events[0].metadata?.causationId).toBe('321');
  })
});
