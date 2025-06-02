import type { Module } from '../../../core/Module.interface'
import type { ICommandBus } from '../../CommandBus/ICommandBus'
import type { Database } from '../../Database/Database'
import type { IEventBus } from '../../EventBus/IEventBus'
import type { IEventStore } from '../../EventStore/IEventStore'
import type { IQueryBus } from '../../QueryBus/IQueryBus'
import { User } from '../../../domain/AggregateRoot/examples/User'
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
  private readonly eventStore: IEventStore
  private readonly eventBus: IEventBus
  private readonly commandBus: ICommandBus
  private readonly queryBus: IQueryBus
  private readonly database: Database

  constructor(
    eventStore: IEventStore,
    eventBus: IEventBus,
    commandBus: ICommandBus,
    queryBus: IQueryBus,
  ) {
    this.eventStore = eventStore
    this.eventBus = eventBus
    this.commandBus = commandBus
    this.queryBus = queryBus
    this.repository = new UserRepository(eventStore, User)
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
