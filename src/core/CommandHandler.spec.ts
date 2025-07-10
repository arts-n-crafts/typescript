import type { CreateUserProps } from '@core/examples/CreateUser.ts'
import type { UserEvent } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import { randomUUID } from 'node:crypto'
import { CreateUser } from '@core/examples/CreateUser.ts'
import { UpdateUserName } from '@core/examples/UpdateUserName.ts'
import { isDomainEvent } from '@domain/utils/isDomainEvent.ts'
import { CreateUserHandler } from './examples/CreateUserHandler.ts'
import { UpdateUserNameHandler } from './examples/UpdateUserNameHandler.ts'

describe('commandHandler', async () => {
  let events: UserEvent[] = []
  const repository: Repository<UserEvent> = {
    async load() {
      return events
    },
    async store(e) {
      events = [...events, ...e]
    },
  }
  const aggregateId = randomUUID()
  const createUserHandler = new CreateUserHandler(repository)
  const props: CreateUserProps = {
    name: 'Elon',
    email: 'musk@x.com',
    age: 52,
  }
  const command = CreateUser(aggregateId, props)
  await createUserHandler.execute(command)

  it('should be defined', () => {
    expect(UpdateUserNameHandler).toBeDefined()
  })

  it('should process the MockCreateUser Command and emit the MockUserCreated Event', async () => {
    const event = events.at(0)
    expect(events).toHaveLength(1)
    expect(event?.type).toBe('UserCreated')
    expect(isDomainEvent(event) && event.aggregateId).toBe(aggregateId)
  })

  it('should process the MockUpdateUserName Command and emit the MockUserNameUpdated Event', async () => {
    const updateUserNameHandler = new UpdateUserNameHandler(repository)
    const payload = { aggregateId, name: 'test' }
    const metadata = { timestamp: new Date() }
    const command = UpdateUserName(aggregateId, payload, metadata)
    await updateUserNameHandler.execute(command)

    const event = events[1]
    expect(events).toHaveLength(2)
    expect(event.type).toBe('UserNameUpdated')
    expect(isDomainEvent(event) && event.aggregateId).toBe(aggregateId)
  })
})
