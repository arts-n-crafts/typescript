import { describe, it, expect, beforeEach } from "vitest";
import { CommandBus } from "./CommandBus";
import { MockUpdateUserNameCommand } from "./mocks/MockUpdateUserNameCommand";
import { MockUpdateUserNameCommandHandler } from "./mocks/MockUpdateUserNameCommandHandler";
import { InMemoryEventStore } from "../EventStore/implementations/InMemoryEventStore";
import type { EventStore } from "../EventStore/EventStore";
import { MockUserRepository } from "../Repository/mocks/MockUserRepository";
import type { AggregateRoot } from "../../domain/AggregateRoot/AggregateRoot";
import type { Repository } from "../Repository/Repository";

describe('CommandBus', () => {
  let eventStore: EventStore;
  let repository: Repository<AggregateRoot<unknown>>
  let commandBus: CommandBus;
  let handler: MockUpdateUserNameCommandHandler;

  beforeEach(() => {
    eventStore = new InMemoryEventStore();
    repository = new MockUserRepository(eventStore);
    commandBus = new CommandBus();
    handler = new MockUpdateUserNameCommandHandler(repository);
  });

  it('should be defined', () => {
    expect(CommandBus).toBeDefined();
  });

  it('should register a command handler', () => {
    commandBus.register(MockUpdateUserNameCommand, handler);
  });

  it.skip('should process the command via commandBus and return the event', async () => {
    commandBus.register(MockUpdateUserNameCommand, handler);

    const command: MockUpdateUserNameCommand = new MockUpdateUserNameCommand(
      { name: 'test' },
      { timestamp: new Date() }
    );
    commandBus.execute(command)

    const events = await eventStore.loadEvents('123');
    expect(events).toHaveLength(1);
    expect(events[0].metadata?.causationId).toBe('321');
  })

  it('should throw an error if no handler is registered for the command type', async () => {
    const command: MockUpdateUserNameCommand = new MockUpdateUserNameCommand(
      { name: 'test' },
      { timestamp: new Date() }
    );

    await expect(commandBus.execute(command)).rejects.toThrow('No handler found for command type: MockUpdateUserNameCommand');
  });

  it('should throw an error if a handler is already registered for the command type', () => {
    commandBus.register(MockUpdateUserNameCommand, handler);

    expect(() => {
      commandBus.register(MockUpdateUserNameCommand, handler);
    }).toThrow('Handler already registered for command type: MockUpdateUserNameCommand');
  });
});
