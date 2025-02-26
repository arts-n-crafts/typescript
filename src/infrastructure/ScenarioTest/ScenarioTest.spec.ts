import type { EventStore } from '../EventStore/EventStore'
import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserCreatedEvent } from '../../domain/DomainEvent/examples/UserCreated'
import { UserNameUpdatedEvent } from '../../domain/DomainEvent/examples/UserNameUpdated'
import { CommandBus } from '../CommandBus/CommandBus'
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
    it('should have executed the command, as an event, in the then step', async () => {
      await scenarioTest
        .given(
          new UserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
        )
        .when(
          new UpdateUserNameCommand({ aggregateId: id, name: 'Donald' }),
        )
        .then(
          new UserNameUpdatedEvent(id, { name: 'Donald' }),
        )
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
})
