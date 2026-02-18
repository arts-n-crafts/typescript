import type { GetUserByEmail } from '@core/examples/GetUserByEmail.ts'
import type { UserCommand, UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'
import type { Outbox } from '@infrastructure/Outbox/Outbox.ts'
import type { OutboxWorker } from '@infrastructure/Outbox/OutboxWorker.ts'
import { randomUUID } from 'node:crypto'
import { ActivateUserHandler } from '@core/examples/ActivateUserHandler.ts'
import { ContractSignedHandler } from '@core/examples/ContractSignedHandler.ts'
import { createRegisterUserCommand } from '@core/examples/CreateUser.ts'
import { CreateUserHandler } from '@core/examples/CreateUserHandler.ts'
import { createGetUserByEmailQuery } from '@core/examples/GetUserByEmail.ts'
import { GetUserByEmailHandler } from '@core/examples/GetUserByEmailHandler.ts'
import { createUpdateNameOfUserCommand } from '@core/examples/UpdateUserName.ts'
import { UpdateUserNameHandler } from '@core/examples/UpdateUserNameHandler.ts'
import { UserCreatedEventHandler } from '@core/examples/UserCreatedEventHandler.ts'
import { UserProjectionHandler } from '@core/examples/UserProjection.ts'
import { User } from '@domain/examples/User.ts'
import { createUserActivatedEvent } from '@domain/examples/UserActivated.ts'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { createUserNameUpdatedEvent } from '@domain/examples/UserNameUpdated.ts'
import { createUserRegistrationEmailSent } from '@domain/examples/UserRegistrationEmailSent.ts'
import { SimpleCommandBus } from '@infrastructure/CommandBus/implementations/SimpleCommandBus.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { createContractSigned } from '@infrastructure/EventBus/examples/CreateContractSigned.ts'
import { SimpleEventBus } from '@infrastructure/EventBus/implementations/SimpleEventBus.ts'
import { createIntegrationEvent } from '@infrastructure/EventBus/utils/createIntegrationEvent.ts'
import { SimpleEventStore } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import { GenericOutboxWorker } from '@infrastructure/Outbox/implementations/GenericOutboxWorker.ts'
import { InMemoryOutbox } from '@infrastructure/Outbox/implementations/InMemoryOutbox.ts'
import { SimpleQueryBus } from '@infrastructure/QueryBus/implementations/SimpleQueryBus.ts'
import { SimpleRepository } from '@infrastructure/Repository/implementations/SimpleRepository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { ScenarioTest } from './ScenarioTest.ts'

describe('scenarioTest', () => {
  const collectionName = 'users'
  const id = randomUUID()

  let database: Database<StoredEvent<UserEvent>, Promise<void>, Promise<StoredEvent<UserEvent>[]>>
  let eventStore: SimpleEventStore<UserEvent>
  let eventBus: SimpleEventBus<UserEvent>
  let outbox: Outbox
  let commandBus: SimpleCommandBus<UserCommand>
  let queryBus: SimpleQueryBus<GetUserByEmail, Record<string, unknown>[]>
  let repository: Repository<UserEvent, Promise<UserState>, Promise<void>>
  let outboxWorker: OutboxWorker
  let scenarioTest: ScenarioTest<UserState, UserEvent>
  let userDatabase: SimpleDatabase<{ id: string, name: string, email: string, prospect: boolean }>

  beforeEach(() => {
    database = new SimpleDatabase()
    outbox = new InMemoryOutbox()
    eventBus = new SimpleEventBus()
    eventStore = new SimpleEventStore(database, outbox)
    commandBus = new SimpleCommandBus()
    queryBus = new SimpleQueryBus()
    outboxWorker = new GenericOutboxWorker(outbox, eventBus, collectionName)
    repository = new SimpleRepository(eventStore, collectionName, User.evolve, User.initialState)
    userDatabase = new SimpleDatabase()

    scenarioTest = new ScenarioTest<UserState, UserEvent>(
      collectionName,
      eventBus,
      eventStore,
      commandBus,
      queryBus,
      repository,
      outboxWorker,
      outbox,
    )

    // register handlers directly — no module
    eventBus.subscribe(collectionName, new UserCreatedEventHandler(repository))
    eventBus.subscribe(collectionName, new ContractSignedHandler(commandBus))
    eventBus.subscribe(collectionName, new UserProjectionHandler(userDatabase))

    commandBus.register('CreateUser', new CreateUserHandler(repository, outbox))
    commandBus.register('UpdateUserName', new UpdateUserNameHandler(repository))
    commandBus.register('ActivateUser', new ActivateUserHandler(repository))

    queryBus.register('GetUserByEmail', new GetUserByEmailHandler(userDatabase) as unknown as Parameters<typeof queryBus.register>[1])
  })

  it('should be defined', () => {
    expect(ScenarioTest).toBeDefined()
  })

  describe('command', () => {
    it('should have published the create command, as an event, in the then step', async () => {
      await scenarioTest
        .when(createRegisterUserCommand(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
        .then(createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
    })

    it('should have published the update command, as an event, in the then step', async () => {
      await scenarioTest
        .given(createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
        .when(createUpdateNameOfUserCommand(id, { name: 'Donald' }))
        .then(createUserNameUpdatedEvent(id, { name: 'Donald' }))
    })

    it('should throw an error if the when is a command and then is not an event or rejection', async () => {
      await expect(
        scenarioTest
          .given(
            createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
            createUserNameUpdatedEvent(id, { name: 'Donald' }),
          )
          .when(createUpdateNameOfUserCommand(id, { name: 'Donald' }))
          .then([]),
      ).rejects.toThrow('When "command" expects a domain event or rejection in the then-step')
    })

    it('should throw an error when a command is given and then the expected event is not triggered', async () => {
      await expect(
        scenarioTest
          .given(createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
          .when(createUpdateNameOfUserCommand(id, { name: 'Donald' }))
          .then(createUserNameUpdatedEvent(randomUUID(), { name: 'Donald' })),
      ).rejects.toThrow('ScenarioTest: event/command was not found')
    })

    it('should find a rejection in the outbox when a command is rejected', async () => {
      await scenarioTest
        .given(createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
        .when(createRegisterUserCommand(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
        .then({
          id: randomUUID(),
          type: 'CreateUserRejected',
          kind: 'rejection',
          commandId: randomUUID(),
          commandType: 'CreateUser',
          reasonCode: 'ALREADY_EXISTS',
          timestamp: Date.now(),
        })
    })

    it('should throw when rejection is not found in outbox', async () => {
      await expect(
        scenarioTest
          .when(createRegisterUserCommand(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
          .then({
            id: randomUUID(),
            type: 'CreateUserRejected',
            kind: 'rejection',
            commandId: randomUUID(),
            commandType: 'CreateUser',
            reasonCode: 'ALREADY_EXISTS',
            timestamp: Date.now(),
          }),
      ).rejects.toThrow('ScenarioTest: rejection was not found in outbox')
    })
  })

  describe('query', () => {
    it('should have executed the query with the expected result in the then step', async () => {
      await scenarioTest
        .given(
          createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
          createUserNameUpdatedEvent(id, { name: 'Donald' }),
        )
        .when(createGetUserByEmailQuery({ email: 'musk@theboringcompany.com' }))
        .then([
          {
            id,
            name: 'Donald',
            email: 'musk@theboringcompany.com',
            prospect: true,
          },
        ])
    })
  })

  describe('domain event', () => {
    it('should have dispatched an event based on listening to an event', async () => {
      await scenarioTest
        .when(createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
        .then(createUserRegistrationEmailSent(id, { status: 'SUCCESS' }))
    })

    it('should throw an error if the when is an event and then is not an event', async () => {
      await expect(
        scenarioTest
          .when(createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
          .then([]),
      ).rejects.toThrow('When "domain event" or "integration event" expects a domain event in the then-step')
    })

    it('should throw an error if the when is an event and then is not found', async () => {
      await expect(
        scenarioTest
          .when(createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
          .then(createUserRegistrationEmailSent(randomUUID(), { status: 'SUCCESS' })),
      ).rejects.toThrow('ScenarioTest: event was not found')
    })
  })

  describe('integration event', () => {
    it('should have dispatched an event based on listening to an integration event', async () => {
      await scenarioTest
        .given(createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
        .when(createContractSigned({ userId: id, product: '1' }))
        .then(createUserActivatedEvent(id, {}))
    })

    it('should handle a pure integration event in the when step', async () => {
      await scenarioTest
        .given(createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
        .when(createIntegrationEvent('createContractSigned', { userId: id, product: '1' }))
        .then(createUserActivatedEvent(id, {}))
    })
  })

  describe('failing cases', () => {
    it('should throw an error if no action (when-step) is provided', async () => {
      await expect(
        scenarioTest
          .given(
            createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
            createUserNameUpdatedEvent(id, { name: 'Donald' }),
          )
          .then([
            {
              id,
              name: 'Donald',
              email: 'musk@theboringcompany.com',
            },
          ]),
      ).rejects.toThrow('In the ScenarioTest, the when-step cannot be empty')
    })
  })
})
