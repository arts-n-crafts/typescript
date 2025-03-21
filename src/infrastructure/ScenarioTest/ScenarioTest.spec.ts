import type { EventStore } from '../EventStore/EventStore'
import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserCreatedEvent } from '../../domain/DomainEvent/examples/UserCreated'
import { UserNameUpdatedEvent } from '../../domain/DomainEvent/examples/UserNameUpdated'
import { UserRegistrationEmailSentEvent } from '../../domain/DomainEvent/examples/UserRegistrationEmailSent'
import { CommandBus } from '../CommandBus/CommandBus'
import { CreateUserCommand } from '../CommandBus/examples/CreateUserCommand'
import { UpdateUserNameCommand } from '../CommandBus/examples/UpdateUserNameCommand'
import { EventBus } from '../EventBus/EventBus'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { GetUserByEmailQuery } from '../QueryBus/examples/GetUserByEmailQuery'
import { QueryBus } from '../QueryBus/QueryBus'
import { UserModule } from './examples/User.module'
import { ScenarioTest } from './ScenarioTest'

describe('scenario test', () => {
  const id = randomUUID()
  let eventStore: EventStore
  let eventBus: EventBus
  let commandBus: CommandBus
  let queryBus: QueryBus
  let scenarioTest: ScenarioTest

  beforeEach(() => {
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
    commandBus = new CommandBus()
    queryBus = new QueryBus()
    scenarioTest = new ScenarioTest(eventStore, eventBus, commandBus, queryBus)
    new UserModule(eventStore, eventBus, commandBus, queryBus).registerModule()
  })

  it('should be defined', async () => {
    expect(ScenarioTest).toBeDefined()
  })

  describe('command', () => {
    it('should have published the create command, as an event, in the then step', async () => {
      await scenarioTest
        .when(
          new CreateUserCommand(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
        )
        .then(
          new UserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
        )
    })

    it('should have published the update command, as an event, in the then step', async () => {
      await scenarioTest
        .given(
          new UserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
        )
        .when(
          new UpdateUserNameCommand(id, { name: 'Donald' }),
        )
        .then(
          new UserNameUpdatedEvent(id, { name: 'Donald' }),
        )
    })

    it('should throw an error if the when is an command and then is not an event', async () => {
      await expect(scenarioTest
        .given(
          new UserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
          new UserNameUpdatedEvent(id, { name: 'Donald' }),
        )
        .when(
          new UpdateUserNameCommand(id, { name: 'Donald' }),
        )
        .then([]),
      ).rejects.toThrowError('In the ScenarioTest, when triggering a command, then an event is expected')
    })

    it('should throw an error when a command is given and then the expected event is not triggered', async () => {
      await expect(scenarioTest
        .given(
          new UserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
        )
        .when(
          new UpdateUserNameCommand(id, { name: 'Donald' }),
        )
        .then(
          new UserNameUpdatedEvent(randomUUID(), { name: 'Donald' }),
        ),
      ).rejects.toThrowError(`In the ScenarioTest, the expected then event (${UserNameUpdatedEvent.name}) was not triggered`)
    })
  })

  describe('query', () => {
    it('should have executed the query with the expected result in the then step', async () => {
      await scenarioTest
        .given(
          new UserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
          new UserNameUpdatedEvent(id, { name: 'Donald' }),
        )
        .when(
          new GetUserByEmailQuery({ email: 'musk@theboringcompany.com' }),
        )
        .then([
          {
            id,
            name: 'Donald',
            email: 'musk@theboringcompany.com',
          },
        ])
    })
  })

  describe('event', () => {
    it('should have dispatched an event based on listening to an event', async () => {
      await scenarioTest
        .when(
          new UserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
        )
        .then(
          new UserRegistrationEmailSentEvent(id, { status: 'SUCCESS' }),
        )
    })

    it('should throw an error if the when is an event and then is not an event', async () => {
      await expect(scenarioTest
        .when(
          new UserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
        )
        .then([]),
      ).rejects.toThrowError('In the ScenarioTest, when triggering from event, then an event is expected')
    })
  })

  describe('failing cases', () => {
    it('should throw an error if no action (when-step) is provided', async () => {
      await expect(scenarioTest
        .given(
          new UserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
          new UserNameUpdatedEvent(id, { name: 'Donald' }),
        )
        .then([
          {
            id,
            name: 'Donald',
            email: 'musk@theboringcompany.com',
          },
        ]),
      ).rejects.toThrowError('In the ScenarioTest, "when" cannot be empty')
    })
  })
})
