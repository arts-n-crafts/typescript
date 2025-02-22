import type { EventStore } from '../EventStore/EventStore'
import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { MockUserCreatedEvent } from '../../domain/DomainEvent/mocks/MockUserCreated'
import { CommandBus } from '../CommandBus/CommandBus'
import { EventBus } from '../EventBus/EventBus'
import { InMemoryEventStore } from '../EventStore/implementations/InMemoryEventStore'
import { QueryBus } from '../QueryBus/QueryBus'
import { ScenarioTest } from './ScenarioTest'

describe('scenario test', () => {
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
  })

  it('should be defined', async () => {
    expect(ScenarioTest).toBeDefined()
  })

  it('should add the events provided to the given step to the eventStore', async () => {
    const id = randomUUID()
    await scenarioTest.given(
      new MockUserCreatedEvent(id, { name: 'Elon', email: 'musk@theboringcompany.com' }),
    )
    expect(await eventStore.loadEvents(id)).toHaveLength(1)
  })
})
