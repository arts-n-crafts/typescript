import type { Module } from '../../../core/Module.interface'
import type { CommandBus } from '../../CommandBus/CommandBus'
import type { Database } from '../../Database/Database'
import type { EventBus } from '../../EventBus/EventBus'
import type { EventStore } from '../../EventStore/EventStore'
import type { QueryBus } from '../../QueryBus/QueryBus'
import { ActivateUserHandler } from '../../CommandBus/examples/ActivateUserHandler'
import { CreateUserHandler } from '../../CommandBus/examples/CreateUserHandler'
import { UpdateUserNameHandler } from '../../CommandBus/examples/UpdateUserNameHandler'
import { InMemoryDatabase } from '../../Database/implementations/InMemoryDatabase'
import { ContractSignedHandler } from '../../EventBus/examples/ContractSignedHandler'
import { UserCreatedEventHandler } from '../../EventBus/examples/UserCreatedEventHandler'
import { UserProjectionHandler } from '../../ProjectionHandler/examples/UserProjection'
import { GetUserByEmailHandler } from '../../QueryBus/examples/GetUserByEmailHandler'
import { UserRepository } from '../../Repository/examples/UserRepository'

export class UserModule implements Module {
  private readonly repository: UserRepository
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
    this.repository = new UserRepository(eventStore)
    this.database = new InMemoryDatabase()
  }

  registerModule() {
    new UserProjectionHandler(this.eventBus, this.database).start()
    this.commandBus.register('CreateUser', new CreateUserHandler(this.repository))
    this.commandBus.register('UpdateUserName', new UpdateUserNameHandler(this.repository))
    this.commandBus.register('ActivateUser', new ActivateUserHandler(this.repository))
    this.eventBus.subscribe(new UserCreatedEventHandler(this.eventStore))
    this.eventBus.subscribe(new ContractSignedHandler(this.commandBus))
    this.queryBus.register('GetUserByEmail', new GetUserByEmailHandler(this.database))
  }
};
