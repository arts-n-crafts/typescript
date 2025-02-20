import { describe, it, expect, beforeEach } from "vitest";
import { CommandBus } from "./CommandBus";
import { MockUpdateUserNameCommand } from "./mocks/MockUpdateUserNameCommand";
import { MockUpdateUserNameCommandHandler } from "./mocks/MockUpdateUserNameCommandHandler";
import { InMemoryEventStore } from "../EventStore/implementations/InMemoryEventStore";
import type { EventStore } from "../EventStore/EventStore";
import { MockUserRepository } from "../Repository/mocks/MockUserRepository";
import type { AggregateRoot } from "../../domain/AggregateRoot/AggregateRoot";
import type { Repository } from "../Repository/Repository";
import { MockCreateUserCommandHandler } from "./mocks/MockCreateUserCommandHandler";
import { MockCreateUserCommand } from "./mocks/MockCreateUserCommand";
import type { MockUserNameUpdatedEvent } from "../../domain/DomainEvent/mocks/MockUserNameUpdated";
import { EventBus } from "../EventBus/EventBus";

describe('CommandBus', () => {
  let eventBus: EventBus;
  let eventStore: EventStore;
  let repository: Repository<AggregateRoot<unknown>>
  let commandBus: CommandBus;
  let handler: MockUpdateUserNameCommandHandler;
  let id: string;

  beforeEach(async () => {
    eventBus = new EventBus();
    eventStore = new InMemoryEventStore(eventBus);
    repository = new MockUserRepository(eventStore);
    commandBus = new CommandBus();
    handler = new MockUpdateUserNameCommandHandler(repository);

    const createUserHandler = new MockCreateUserCommandHandler(repository);
    const command = new MockCreateUserCommand({ name: 'Elon', email: 'musk@x.com', age: 52 }, null);
    const result = await createUserHandler.execute(command)
    id = result.id
  });

  it('should be defined', () => {
    expect(CommandBus).toBeDefined();
  });

  it('should register a command handler', () => {
    commandBus.register(MockUpdateUserNameCommand, handler);
  });

  it('should process the command via commandBus and return the event', async () => {
    commandBus.register(MockUpdateUserNameCommand, handler);

    const command: MockUpdateUserNameCommand = new MockUpdateUserNameCommand(
      { aggregateId: id, name: 'test' },
      { timestamp: new Date() }
    );
    await commandBus.execute(command)

    const events = await eventStore.loadEvents(id);
    const event = events.at(-1) as MockUserNameUpdatedEvent;
    expect(events).toHaveLength(2);
    expect(event.payload.name).toBe('test');
  })

  it('should throw an error if no handler is registered for the command type', async () => {
    const command: MockUpdateUserNameCommand = new MockUpdateUserNameCommand(
      { aggregateId: '123', name: 'test' },
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
