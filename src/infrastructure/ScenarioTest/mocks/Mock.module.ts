import type { CommandBus } from '../../CommandBus/CommandBus'
import type { Database } from '../../Database/Database'
import type { EventBus } from '../../EventBus/EventBus'
import type { EventStore } from '../../EventStore/EventStore'
import type { QueryBus } from '../../QueryBus/QueryBus'
import { MockCreateUserCommand } from '../../CommandBus/mocks/MockCreateUserCommand'
import { MockCreateUserCommandHandler } from '../../CommandBus/mocks/MockCreateUserCommandHandler'
import { MockUpdateUserNameCommand } from '../../CommandBus/mocks/MockUpdateUserNameCommand'
import { MockUpdateUserNameCommandHandler } from '../../CommandBus/mocks/MockUpdateUserNameCommandHandler'
import { InMemoryDatabase } from '../../Database/implementations/InMemoryDatabase'
import { MockUserCreatedEventHandler } from '../../EventBus/mocks/MockUserCreatedEventHandler'
import { MockUserProjectionHandler } from '../../ProjectionHandler/mocks/MockUserProjection'
import { MockGetUserByEmailQuery } from '../../QueryBus/mocks/MockGetUserByEmailQuery'
import { MockGetUserByEmailQueryHandler } from '../../QueryBus/mocks/MockGetUserByEmailQueryHandler'
import { MockUserRepository } from '../../Repository/mocks/MockUserRepository'

export interface Module {
  registerModule: () => void
}

export class MockModule implements Module {
  private readonly repository: MockUserRepository
  private readonly eventStore: EventStore
  private readonly eventBus: EventBus
  private readonly commandBus: CommandBus
  private readonly queryBus: QueryBus
  private readonly database: Database

  constructor(
    eventStore: EventStore,
    eventBus: EventBus,
    commandBus: CommandBus,
    queryBus: QueryBus,
  ) {
    this.eventStore = eventStore
    this.eventBus = eventBus
    this.commandBus = commandBus
    this.queryBus = queryBus
    this.repository = new MockUserRepository(eventStore)
    this.database = new InMemoryDatabase()
  }

  registerModule() {
    new MockUserProjectionHandler(this.eventBus, this.database).start()
    this.commandBus.register(MockCreateUserCommand, new MockCreateUserCommandHandler(this.repository))
    this.commandBus.register(MockUpdateUserNameCommand, new MockUpdateUserNameCommandHandler(this.repository))
    this.eventBus.subscribe(new MockUserCreatedEventHandler(this.eventStore))
    this.queryBus.register(MockGetUserByEmailQuery, new MockGetUserByEmailQueryHandler(this.database))
  }
};
