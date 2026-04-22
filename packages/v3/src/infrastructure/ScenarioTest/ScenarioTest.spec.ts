import type { GetUserByEmail } from "@core/examples/GetUserByEmail.ts";
import type { UserCommand, UserEvent, UserState } from "@domain/examples/User.ts";
import type { Repository } from "@domain/Repository.ts";
import type { Database } from "@infrastructure/Database/Database.ts";
import type { StoredEvent } from "@infrastructure/EventStore/StoredEvent.ts";
import type { Outbox } from "@infrastructure/Outbox/Outbox.ts";
import type { OutboxWorker } from "@infrastructure/Outbox/OutboxWorker.ts";
import { randomUUID } from "node:crypto";
import { createRegisterUserCommand } from "@core/examples/CreateUser.ts";
import { createGetUserByEmailQuery } from "@core/examples/GetUserByEmail.ts";
import { createUpdateNameOfUserCommand } from "@core/examples/UpdateUserName.ts";
import { User } from "@domain/examples/User.ts";
import { createUserActivatedEvent } from "@domain/examples/UserActivated.ts";
import { createUserCreatedEvent } from "@domain/examples/UserCreated.ts";
import { createUserNameUpdatedEvent } from "@domain/examples/UserNameUpdated.ts";
import { createUserRegistrationEmailSent } from "@domain/examples/UserRegistrationEmailSent.ts";
import { SimpleDatabase } from "@infrastructure/Database/implementations/SimpleDatabase.ts";
import { SimpleEventStore } from "@infrastructure/EventStore/implementations/SimpleEventStore.ts";
import { GenericOutboxWorker } from "@infrastructure/Outbox/implementations/GenericOutboxWorker.ts";
import { InMemoryOutbox } from "@infrastructure/Outbox/implementations/InMemoryOutbox.ts";
import { SimpleRepository } from "@infrastructure/Repository/implementations/SimpleRepository.ts";
import { SimpleCommandBus } from "../CommandBus/implementations/SimpleCommandBus.ts";
import { ContractSigned } from "../EventBus/examples/ContractSigned.ts";
import { ProductCreated } from "../EventBus/examples/ProductCreated.ts";
import { SimpleEventBus } from "../EventBus/implementations/SimpleEventBus.ts";
import { SimpleQueryBus } from "../QueryBus/implementations/SimpleQueryBus.ts";
import { UserModule } from "./examples/User.module.ts";
import { ScenarioTest } from "./ScenarioTest.ts";

describe("scenario test", () => {
  const collectionName = "users";
  const id = randomUUID();
  let database: Database<StoredEvent<UserEvent>, Promise<void>, Promise<StoredEvent<UserEvent>[]>>;
  let eventStore: SimpleEventStore<UserEvent>;
  let eventBus: SimpleEventBus<UserEvent>;
  let outbox: Outbox;
  let commandBus: SimpleCommandBus<UserCommand>;
  let queryBus: SimpleQueryBus<GetUserByEmail, Record<string, unknown>[]>;
  let repository: Repository<UserEvent, Promise<UserState>, Promise<void>>;
  let outboxWorker: OutboxWorker;
  let scenarioTest: ScenarioTest<UserState, UserEvent>;

  beforeEach(() => {
    database = new SimpleDatabase();
    eventBus = new SimpleEventBus();
    outbox = new InMemoryOutbox();
    eventStore = new SimpleEventStore(database, outbox);
    commandBus = new SimpleCommandBus();
    queryBus = new SimpleQueryBus();
    outboxWorker = new GenericOutboxWorker(outbox, eventBus, "users");
    repository = new SimpleRepository(eventStore, collectionName, User.evolve, User.initialState);

    scenarioTest = new ScenarioTest<UserState, UserEvent>(
      collectionName,
      eventBus,
      eventStore,
      commandBus,
      queryBus,
      repository,
      outboxWorker,
    );
    new UserModule(eventStore, eventBus, commandBus, queryBus).registerModule();
  });

  it("should be defined", async () => {
    expect(ScenarioTest).toBeDefined();
  });

  describe("command", () => {
    it("should have published the create command, as an event, in the then step", async () => {
      await scenarioTest
        .When(createRegisterUserCommand(id, { name: "Elon", email: "musk@theboringcompany.com" }))
        .Then(createUserCreatedEvent(id, { name: "Elon", email: "musk@theboringcompany.com" }));
    });

    it("should have published the update command, as an event, in the then step", async () => {
      await scenarioTest
        .Given(createUserCreatedEvent(id, { name: "Elon", email: "musk@theboringcompany.com" }))
        .When(createUpdateNameOfUserCommand(id, { name: "Donald" }))
        .Then(createUserNameUpdatedEvent(id, { name: "Donald" }));
    });

    it("should throw an error if the when is an command and then is not an event", async () => {
      await expect(
        scenarioTest
          .Given(
            createUserCreatedEvent(id, { name: "Elon", email: "musk@theboringcompany.com" }),
            createUserNameUpdatedEvent(id, { name: "Donald" }),
          )
          .When(createUpdateNameOfUserCommand(id, { name: "Donald" }))
          .Then([]),
      ).rejects.toThrow('When "command" expects a domain event in the then-step');
    });

    it("should throw an error when a command is given and then the expected event is not triggered", async () => {
      await expect(
        scenarioTest
          .Given(createUserCreatedEvent(id, { name: "Elon", email: "musk@theboringcompany.com" }))
          .When(createUpdateNameOfUserCommand(id, { name: "Donald" }))
          .Then(createUserNameUpdatedEvent(randomUUID(), { name: "Donald" })),
      ).rejects.toThrow(`ScenarioTest: event/command was not found`);
    });
  });

  describe("query", () => {
    it("should have executed the query with the expected result in the then step", async () => {
      await scenarioTest
        .Given(
          createUserCreatedEvent(id, { name: "Elon", email: "musk@theboringcompany.com" }),
          createUserNameUpdatedEvent(id, { name: "Donald" }),
        )
        .When(createGetUserByEmailQuery({ email: "musk@theboringcompany.com" }))
        .Then([
          {
            id,
            name: "Donald",
            email: "musk@theboringcompany.com",
            prospect: true,
          },
        ]);
    });
  });

  describe("domain event", () => {
    it("should have dispatched an event based on listening to an event", async () => {
      await scenarioTest
        .When(createUserCreatedEvent(id, { name: "Elon", email: "musk@theboringcompany.com" }))
        .Then(createUserRegistrationEmailSent(id, { status: "SUCCESS" }));
    });

    it("should throw an error if the when is an event and then is not an event", async () => {
      await expect(
        scenarioTest
          .When(createUserCreatedEvent(id, { name: "Elon", email: "musk@theboringcompany.com" }))
          .Then([]),
      ).rejects.toThrow(
        'When "domain event" or "integration event" expects a domain event in the then-step',
      );
    });

    it("should throw an error if the when is an event and then is not found", async () => {
      await expect(
        scenarioTest
          .When(createUserCreatedEvent(id, { name: "Elon", email: "musk@theboringcompany.com" }))
          .Then(createUserRegistrationEmailSent(randomUUID(), { status: "SUCCESS" })),
      ).rejects.toThrow(`ScenarioTest: event was not found`);
    });
  });

  describe("integration event", () => {
    it("should have dispatched an event based on listening to an event", async () => {
      await scenarioTest
        .Given(createUserCreatedEvent(id, { name: "Elon", email: "musk@theboringcompany.com" }))
        .When(ContractSigned({ userId: id, product: "1" }))
        .Then(createUserActivatedEvent(id, {}));
    });

    it("should allow integration events", async () => {
      await scenarioTest
        .Given(
          ProductCreated({
            productId: "1",
            name: "Product 1",
          }),
        )
        .When(createUserCreatedEvent(id, { name: "Elon", email: "musk@theboringcompany.com" }))
        .Then(createUserRegistrationEmailSent(id, { status: "SUCCESS" }));
    });
  });

  describe("failing cases", () => {
    it("should throw an error if no action (when-step) is provided", async () => {
      await expect(
        scenarioTest
          .Given(
            createUserCreatedEvent(id, { name: "Elon", email: "musk@theboringcompany.com" }),
            createUserNameUpdatedEvent(id, { name: "Donald" }),
          )
          .Then([
            {
              id,
              name: "Donald",
              email: "musk@theboringcompany.com",
            },
          ]),
      ).rejects.toThrow("In the ScenarioTest, the when-step cannot be empty");
    });
  });
});
