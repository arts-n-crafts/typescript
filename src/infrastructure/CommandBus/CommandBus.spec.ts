import { describe, it, expect, beforeEach } from "vitest";
import { CommandBus } from "./CommandBus";
import { MockCommand } from "./mocks/MockCommand";
import { MockCommandHandler } from "./mocks/MockCommandHandler";
import { InMemoryEventStore } from "../EventStore/implementations/InMemoryEventStore";
import type { EventStore } from "../EventStore/EventStore";

describe('CommandBus', () => {
  let eventStore: EventStore;
  let commandBus: CommandBus;
  let handler: MockCommandHandler;

  beforeEach(() => {
    eventStore = new InMemoryEventStore();
    commandBus = new CommandBus();
    handler = new MockCommandHandler(eventStore);
  });

  it('should be defined', () => {
    expect(CommandBus).toBeDefined();
  });

  it('should register a command handler', () => {
    commandBus.register(MockCommand, handler);
  });

  it('should process the command via commandBus and return the event', async () => {
    commandBus.register(MockCommand, handler);

    const command: MockCommand = new MockCommand(
      { name: 'test' },
      { timestamp: new Date() }
    );
    commandBus.execute(command)

    const events = await eventStore.loadEvents('123');
    expect(events).toHaveLength(1);
    expect(events[0].metadata?.causationId).toBe('321');
  })
  
  it('should throw an error if no handler is registered for the command type', async () => {
    const command: MockCommand = new MockCommand(
      { name: 'test' },
      { timestamp: new Date() }
    );

    await expect(commandBus.execute(command)).rejects.toThrow('No handler found for command type: MockCommand');
  });
  
  it('should throw an error if a handler is already registered for the command type', () => {
    commandBus.register(MockCommand, handler);

    expect(() => {
      commandBus.register(MockCommand, handler);
    }).toThrow('Handler already registered for command type: MockCommand');
  });
});
