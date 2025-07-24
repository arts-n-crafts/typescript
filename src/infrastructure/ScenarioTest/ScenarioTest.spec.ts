import type { UserEvent, UserState } from '@domain/examples/User.ts'
import type { Outbox } from '@infrastructure/Outbox/Outbox.ts'
import type { OutboxWorker } from '@infrastructure/Outbox/OutboxWorker.ts'
import type { CommandBus } from '../CommandBus/CommandBus.ts'
import type { QueryBus } from '../QueryBus/QueryBus.ts'
import { randomUUID } from 'node:crypto'
import { CreateUser } from '@core/examples/CreateUser.ts'
import { createGetUserByEmailQuery } from '@core/examples/GetUserByEmail.ts'
import { UpdateUserName } from '@core/examples/UpdateUserName.ts'
import { User } from '@domain/examples/User.ts'
import { UserActivated } from '@domain/examples/UserActivated.ts'
import { UserCreated } from '@domain/examples/UserCreated.ts'
import { UserNameUpdated } from '@domain/examples/UserNameUpdated.ts'
import { UserRegistrationEmailSent } from '@domain/examples/UserRegistrationEmailSent.ts'
import { InMemoryDatabase } from '@infrastructure/Database/implementations/InMemoryDatabase.ts'
import { GenericEventStore } from '@infrastructure/EventStore/implementations/GenericEventStore.ts'
import { GenericOutboxWorker } from '@infrastructure/Outbox/implementations/GenericOutboxWorker.ts'
import { InMemoryOutbox } from '@infrastructure/Outbox/implementations/InMemoryOutbox.ts'
import { UserRepository } from '@infrastructure/Repository/examples/UserRepository.ts'
import { InMemoryCommandBus } from '../CommandBus/implementations/InMemoryCommandBus.ts'
import { ContractSigned } from '../EventBus/examples/ContractSigned.ts'
import { ProductCreated } from '../EventBus/examples/ProductCreated.ts'
import { InMemoryEventBus } from '../EventBus/implementations/InMemoryEventBus.ts'
import { InMemoryQueryBus } from '../QueryBus/implementations/InMemoryQueryBus.ts'
import { UserModule } from './examples/User.module.ts'
import { ScenarioTest } from './ScenarioTest.ts'

describe('scenario test', () => {
  const id = randomUUID()
  let database: InMemoryDatabase
  let eventStore: GenericEventStore
  let eventBus: InMemoryEventBus
  let outbox: Outbox
  let commandBus: CommandBus
  let queryBus: QueryBus
  let repository: UserRepository
  let outboxWorker: OutboxWorker
  let scenarioTest: ScenarioTest<UserState, UserEvent>

  beforeEach(() => {
    database = new InMemoryDatabase()
    eventBus = new InMemoryEventBus()
    outbox = new InMemoryOutbox()
    eventStore = new GenericEventStore(database, { outbox })
    commandBus = new InMemoryCommandBus()
    queryBus = new InMemoryQueryBus()
    outboxWorker = new GenericOutboxWorker(outbox, eventBus)
    repository = new UserRepository(eventStore, 'users', User.evolve, User.initialState)

    scenarioTest = new ScenarioTest('users', eventBus, eventStore, commandBus, queryBus, repository, outboxWorker)
    new UserModule(eventStore, eventBus, commandBus, queryBus).registerModule()
  })

  it('should be defined', async () => {
    expect(ScenarioTest).toBeDefined()
  })

  describe('command', () => {
    it('should have published the create command, as an event, in the then step', async () => {
      await scenarioTest
        .when(CreateUser(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
        .then(UserCreated(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
    })

    it('should have published the update command, as an event, in the then step', async () => {
      await scenarioTest
        .given(UserCreated(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
        .when(UpdateUserName(id, { name: 'Donald' }))
        .then(UserNameUpdated(id, { name: 'Donald' }))
    })

    it('should throw an error if the when is an command and then is not an event', async () => {
      await expect(
        scenarioTest
          .given(
            UserCreated(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
            UserNameUpdated(id, { name: 'Donald' }),
          )
          .when(UpdateUserName(id, { name: 'Donald' }))
          .then([]),
      ).rejects.toThrow(
        'When "command" expects a domain event in the then-step',
      )
    })

    it('should throw an error when a command is given and then the expected event is not triggered', async () => {
      await expect(
        scenarioTest
          .given(UserCreated(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
          .when(UpdateUserName(id, { name: 'Donald' }))
          .then(UserNameUpdated(randomUUID(), { name: 'Donald' })),
      ).rejects.toThrow(`ScenarioTest: event/command was not found`)
    })
  })

  describe('query', () => {
    it('should have executed the query with the expected result in the then step', async () => {
      await scenarioTest
        .given(
          UserCreated(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
          UserNameUpdated(id, { name: 'Donald' }),
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
        .when(UserCreated(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
        .then(UserRegistrationEmailSent(id, { status: 'SUCCESS' }))
    })

    it('should throw an error if the when is an event and then is not an event', async () => {
      await expect(
        scenarioTest
          .when(UserCreated(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
          .then([]),
      ).rejects.toThrow(
        'When "domain event" or "integration event" expects a domain event in the then-step',
      )
    })

    it('should throw an error if the when is an event and then is not found', async () => {
      await expect(
        scenarioTest
          .when(UserCreated(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
          .then(UserRegistrationEmailSent(randomUUID(), { status: 'SUCCESS' })),
      ).rejects.toThrow(`ScenarioTest: event was not found`)
    })
  })

  describe('integration event', () => {
    it('should have dispatched an event based on listening to an event', async () => {
      await scenarioTest
        .given(UserCreated(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
        .when(ContractSigned({ userId: id, product: '1' }))
        .then(UserActivated(id, {}))
    })

    it('should allow integration events', async () => {
      await scenarioTest
        .given(
          ProductCreated({
            productId: '1',
            name: 'Product 1',
          }),
        )
        .when(UserCreated(id, { name: 'Elon', email: 'musk@theboringcompany.com' }))
        .then(UserRegistrationEmailSent(id, { status: 'SUCCESS' }))
    })
  })

  describe('failing cases', () => {
    it('should throw an error if no action (when-step) is provided', async () => {
      await expect(
        scenarioTest
          .given(
            UserCreated(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
            UserNameUpdated(id, { name: 'Donald' }),
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
