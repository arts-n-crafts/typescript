import type { EventStore } from '../EventStore/EventStore'
import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { MockUserCreatedEvent } from '../../domain/DomainEvent/mocks/MockUserCreated'
import { MockUserNameUpdatedEvent } from '../../domain/DomainEvent/mocks/MockUserNameUpdated'
import { CommandBus } from '../CommandBus/CommandBus'
import { MockUpdateUserNameCommand } from '../CommandBus/mocks/MockUpdateUserNameCommand'
import { EventBus } from '../EventBus/EventBus'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { QueryBus } from '../QueryBus/QueryBus'
import { MockModule } from './mocks/Mock.module'
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
    new MockModule(eventStore, eventBus, commandBus, queryBus).registerModule()
  })

  it('should be defined', async () => {
    expect(ScenarioTest).toBeDefined()
  })

  describe('command', () => {
    it('should have executed the command, as an event, in the then step', async () => {
      await scenarioTest
        .given(
          new MockUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
        )
        .when(
          new MockUpdateUserNameCommand({ aggregateId: id, name: 'Donald' }),
        )
        .then(
          new MockUserNameUpdatedEvent(id, { name: 'Donald' }),
        )
    })
  })
})
