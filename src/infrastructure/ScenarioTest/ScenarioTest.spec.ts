import type { UserEvent } from '../../domain/examples/User'
import type { CommandBus } from '../CommandBus/CommandBus'
import type { EventBus } from '../EventBus/EventBus'
import type { EventStore } from '../EventStore/EventStore'
import type { QueryBus } from '../QueryBus/QueryBus'
import { randomUUID } from 'node:crypto'
import { CreateUser } from '../../domain/examples/CreateUser'
import { GetUserByEmail } from '../../domain/examples/GetUserByEmail'
import { UpdateUserName } from '../../domain/examples/UpdateUserName'
import { UserActivated } from '../../domain/examples/UserActivated'
import { UserCreated } from '../../domain/examples/UserCreated'
import { UserNameUpdated } from '../../domain/examples/UserNameUpdated'
import { UserRegistrationEmailSent } from '../../domain/examples/UserRegistrationEmailSent'
import { InMemoryCommandBus } from '../CommandBus/implementations/InMemoryCommandBus'
import { ContractSigned } from '../EventBus/examples/ContractSigned'
import { ProductCreated } from '../EventBus/examples/ProductCreated'
import { InMemoryEventBus } from '../EventBus/implementations/InMemoryEventBus'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { InMemoryQueryBus } from '../QueryBus/implementations/InMemoryQueryBus'
import { UserModule } from './examples/User.module'
import { ScenarioTest } from './ScenarioTest'

describe('scenario test', () => {
  const id = randomUUID()
  let eventStore: EventStore<UserEvent>
  let eventBus: EventBus<UserEvent>
  let commandBus: CommandBus
  let queryBus: QueryBus
  let scenarioTest: ScenarioTest

  beforeEach(() => {
    eventBus = new InMemoryEventBus()
    eventStore = new InMemoryEventStore(eventBus)
    commandBus = new InMemoryCommandBus()
    queryBus = new InMemoryQueryBus()
    scenarioTest = new ScenarioTest(eventStore, eventBus, commandBus, queryBus)
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
        'In the ScenarioTest, when triggering a command, then a domain event is expected',
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
        .when(GetUserByEmail({ email: 'musk@theboringcompany.com' }))
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
        'In the ScenarioTest, when triggering from event, then an event is expected',
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
      ).rejects.toThrow('In the ScenarioTest, "when" cannot be empty')
    })
  })
})
