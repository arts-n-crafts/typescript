import type { UserCommand, UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'
import { randomUUID } from 'node:crypto'
import { ActivateUserHandler } from '@core/examples/ActivateUserHandler.ts'
import { ContractSignedHandler } from '@core/examples/ContractSignedHandler.ts'
import { createRegisterUserCommand } from '@core/examples/CreateUser.ts'
import { CreateUserHandler } from '@core/examples/CreateUserHandler.ts'
import { User } from '@domain/examples/User.ts'
import { createUserNameUpdatedEvent } from '@domain/examples/UserNameUpdated.ts'
import { SimpleCommandBus } from '@infrastructure/CommandBus/implementations/SimpleCommandBus.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { createContractSigned } from '@infrastructure/EventBus/examples/CreateContractSigned.ts'
import { SimpleEventStore } from '@infrastructure/EventStore/implementations/SimpleEventStore.ts'
import { InMemoryOutbox } from '@infrastructure/Outbox/implementations/InMemoryOutbox.ts'
import { SimpleRepository } from '@infrastructure/Repository/implementations/SimpleRepository.ts'

describe('contractSignedHandler', () => {
  let database: Database<StoredEvent<UserEvent>, Promise<void>, Promise<StoredEvent<UserEvent>[]>>
  let eventStore: EventStore<UserEvent, Promise<void>, Promise<UserEvent[]>>
  let repository: Repository<UserEvent, Promise<UserState>>
  let outbox: InMemoryOutbox
  let commandBus: SimpleCommandBus<UserCommand>
  let createUserHandler: CreateUserHandler
  let contractSignedHandler: ContractSignedHandler
  let activateUserHandler: ActivateUserHandler
  const createUserCommand = createRegisterUserCommand(randomUUID(), {
    name: 'Elon',
    email: 'musk@x.com',
    age: 52,
  })
  const contractSignedEvent = createContractSigned({
    userId: <string>createUserCommand.aggregateId,
    product: '1',
  }, {})

  beforeEach(async () => {
    database = new SimpleDatabase()
    outbox = new InMemoryOutbox()
    eventStore = new SimpleEventStore(database, outbox)
    repository = new SimpleRepository(eventStore, 'users', User.evolve, User.initialState)
    commandBus = new SimpleCommandBus()
    createUserHandler = new CreateUserHandler(repository, outbox)
    await createUserHandler.execute(createUserCommand)
    contractSignedHandler = new ContractSignedHandler(commandBus)
    activateUserHandler = new ActivateUserHandler(repository, outbox)
    commandBus.register('ActivateUser', activateUserHandler)

    const events = await eventStore.load('users', <string>createUserCommand.aggregateId)
    const currentState = events.reduce(User.evolve, User.initialState(<string>createUserCommand.aggregateId))
    expect(currentState.prospect).toBe(true)
  })

  it('should be defined', () => {
    expect(ContractSignedHandler).toBeDefined()
  })

  it('should activate the user when a contract is signed', async () => {
    await contractSignedHandler.handle(contractSignedEvent)
    const events = await eventStore.load('users', <string>createUserCommand.aggregateId)
    const currentState = events.reduce(User.evolve, User.initialState(<string>createUserCommand.aggregateId))
    expect(events).toHaveLength(2)
    expect(currentState.prospect).toBe(false)
  })

  it('should do nothing if the event is not a contract signed event', async () => {
    const event = createUserNameUpdatedEvent(<string>createUserCommand.aggregateId, { name: 'Henk' })
    await contractSignedHandler.handle(event)
    const events = await eventStore.load('users', <string>createUserCommand.aggregateId)
    const currentState = events.reduce(User.evolve, User.initialState(<string>createUserCommand.aggregateId))
    expect(events).toHaveLength(1)
    expect(currentState.prospect).toBe(true)
  })
})
