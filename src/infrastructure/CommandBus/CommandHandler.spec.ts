import { describe, it, expect, beforeEach } from "vitest";
import { MockUpdateUserNameCommandHandler } from "./mocks/MockUpdateUserNameCommandHandler";
import type { EventStore } from "../EventStore/EventStore";
import { MockUpdateUserNameCommand } from "./mocks/MockUpdateUserNameCommand";
import { MockUserRepository } from "../Repository/mocks/MockUserRepository";
import { InMemoryEventStore } from "../EventStore/implementations/InMemoryEventStore";
import type { Repository } from "../Repository/Repository";
import type { AggregateRoot } from "../../domain/AggregateRoot/AggregateRoot";
import { MockCreateUserCommand, type MockCreateUserCommandProps } from "./mocks/MockCreateUserCommand";
import { MockCreateUserCommandHandler } from "./mocks/MockCreateUserCommandHandler";
import { MockUserCreatedEvent } from "../../domain/DomainEvent/mocks/MockUserCreated";

describe('CommandHandler', () => {
  let aggregateId: string;
  let eventStore: EventStore;
  let repository: Repository<AggregateRoot<unknown>>
  let updateUserNameHandler: MockUpdateUserNameCommandHandler;

  beforeEach(async () => {
    eventStore = new InMemoryEventStore();
    repository = new MockUserRepository(eventStore);
    const createUserHandler = new MockCreateUserCommandHandler(repository);
    updateUserNameHandler = new MockUpdateUserNameCommandHandler(repository);

    const props: MockCreateUserCommandProps = {
      name: 'Elon',
      email: 'musk@x.com',
      age: 52
    }
    const command = new MockCreateUserCommand(props, null);
    const { id } = await createUserHandler.execute(command)
    aggregateId = id;
  })

  it('should be defined', () => {
    expect(MockUpdateUserNameCommandHandler).toBeDefined();
  });

  it('should process the command and emit the UserCreated event', async () => {
    const events = await eventStore.loadEvents(aggregateId);
    const event = events[0];
    expect(events).toHaveLength(1);
    expect(event).toBeInstanceOf(MockUserCreatedEvent);
    expect(event.aggregateId).toBe(aggregateId);
  })

  it.skip('should process the command and return an event', async () => {
    const command: MockUpdateUserNameCommand = new MockUpdateUserNameCommand(
      { name: 'test' },
      { timestamp: new Date() }
    );
    updateUserNameHandler.execute(command)
    const events = await eventStore.loadEvents('123');
    expect(events).toHaveLength(1);
    expect(events[0].metadata?.causationId).toBe('321');
  })
});
