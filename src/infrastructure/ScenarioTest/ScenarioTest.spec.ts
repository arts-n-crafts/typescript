import type { GetUserByEmail } from '@core/examples/GetUserByEmail.ts'
import type { UserCommand, UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'
import type { Outbox } from '@infrastructure/Outbox/Outbox.ts'
import type { OutboxWorker } from '@infrastructure/Outbox/OutboxWorker.ts'
import { randomUUID } from 'node:crypto'
import { createRegisterUserCommand } from '@core/examples/CreateUser.ts'
import { createGetUserByEmailQuery } from '@core/examples/GetUserByEmail.ts'
import { createUpdateNameOfUserCommand } from '@core/examples/UpdateUserName.ts'
import { User } from '@domain/examples/User.ts'
import { createUserActivatedEvent } from '@domain/examples/UserActivated.ts'
import { createUserCreatedEvent } from '@domain/examples/UserCreated.ts'
import { createUserNameUpdatedEvent } from '@domain/examples/UserNameUpdated.ts'
import { createUserRegistrationEmailSent } from '@domain/examples/UserRegistrationEmailSent.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { SimpleEventStore } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import { GenericOutboxWorker } from '@infrastructure/Outbox/implementations/GenericOutboxWorker.ts'
import { InMemoryOutbox } from '@infrastructure/Outbox/implementations/InMemoryOutbox.ts'
import { SimpleRepository } from '@infrastructure/Repository/implementations/SimpleRepository.ts'
import { SimpleCommandBus } from '../CommandBus/implementations/SimpleCommandBus.ts'
import { ContractSigned } from '../EventBus/examples/ContractSigned.ts'
import { ProductCreated } from '../EventBus/examples/ProductCreated.ts'
import { SimpleEventBus } from '../EventBus/implementations/SimpleEventBus.ts'
import { SimpleQueryBus } from '../QueryBus/implementations/SimpleQueryBus.ts'
import { UserModule } from './examples/User.module.ts'
import { ScenarioTest } from './ScenarioTest.ts'

describe('scenario test', () => {
  const collectionName = 'users'
  const id = randomUUID()
  let database: Database<StoredEvent<UserEvent>>
  let eventStore: SimpleEventStore<UserEvent>
  let eventBus: SimpleEventBus<UserEvent>
  let outbox: Outbox
  let commandBus: SimpleCommandBus<UserCommand>
  let queryBus: SimpleQueryBus<GetUserByEmail, Array<Record<string, unknown>>>
  let repository: Repository<UserEvent, UserState>
  let outboxWorker: OutboxWorker
  let scenarioTest: ScenarioTest<UserState, UserEvent>

  beforeEach(() => {
    database = new SimpleDatabase()
    eventBus = new SimpleEventBus()
    outbox = new InMemoryOutbox()
    eventStore = new SimpleEventStore(database, outbox)
    commandBus = new SimpleCommandBus()
    queryBus = new SimpleQueryBus()
    outboxWorker = new GenericOutboxWorker(outbox, eventBus)
    repository = new SimpleRepository(eventStore, collectionName, User.evolve, User.initialState)

    scenarioTest = new ScenarioTest(collectionName, eventBus, eventStore, commandBus, queryBus, repository, outboxWorker)
    new UserModule(eventStore, eventBus, commandBus, queryBus).registerModule()
  })

  it('should be defined', async () => {
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

    it('should throw an error if the when is an command and then is not an event', async () => {
      await expect(
        scenarioTest
          .given(
            createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
            createUserNameUpdatedEvent(id, { name: 'Donald' }),
          )
          .when(createUpdateNameOfUserCommand(id, { name: 'Donald' }))
          .then([]),
      ).rejects.toThrow(
        'When "command" expects a domain event in the then-step',
      )
    })

    it('should throw an error when a command is given and then the expected event is not triggered', async () => {
      await expect(
        scenarioTest
          .given(createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
          .when(createUpdateNameOfUserCommand(id, { name: 'Donald' }))
          .then(createUserNameUpdatedEvent(randomUUID(), { name: 'Donald' })),
      ).rejects.toThrow(`ScenarioTest: event/command was not found`)
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
      ).rejects.toThrow(
        'When "domain event" or "integration event" expects a domain event in the then-step',
      )
    })

    it('should throw an error if the when is an event and then is not found', async () => {
      await expect(
        scenarioTest
          .when(createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
          .then(createUserRegistrationEmailSent(randomUUID(), { status: 'SUCCESS' })),
      ).rejects.toThrow(`ScenarioTest: event was not found`)
    })
  })

  describe('integration event', () => {
    it('should have dispatched an event based on listening to an event', async () => {
      await scenarioTest
        .given(createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
        .when(ContractSigned({ userId: id, product: '1' }))
        .then(createUserActivatedEvent(id, {}))
    })

    it('should allow integration events', async () => {
      await scenarioTest
        .given(
          ProductCreated({
            productId: '1',
            name: 'Product 1',
          }),
        )
        .when(createUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
        .then(createUserRegistrationEmailSent(id, { status: 'SUCCESS' }))
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
