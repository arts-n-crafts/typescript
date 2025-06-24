import type { Module } from '../../../core'
import type { UserEvent } from '../../../domain/examples/User'
import type { CommandBus } from '../../CommandBus/CommandBus'
import type { Database } from '../../Database/Database'
import type { EventBus } from '../../EventBus/EventBus'
import type { EventStore } from '../../EventStore/EventStore'
import type { QueryBus } from '../../QueryBus/QueryBus'
import { ActivateUserHandler } from '../../../core/examples/ActivateUserHandler'
import { ContractSignedHandler } from '../../../core/examples/ContractSignedHandler'
import { CreateUserHandler } from '../../../core/examples/CreateUserHandler'
import { GetUserByEmailHandler } from '../../../core/examples/GetUserByEmailHandler'
import { UpdateUserNameHandler } from '../../../core/examples/UpdateUserNameHandler'
import { UserCreatedEventHandler } from '../../../core/examples/UserCreatedEventHandler'
import { UserProjectionHandler } from '../../../core/examples/UserProjection'
import { InMemoryDatabase } from '../../Database/implementations/InMemoryDatabase'
import { UserRepository } from '../../Repository/examples/UserRepository'

export class UserModule implements Module {
  private readonly repository: UserRepository

  private readonly database: Database

  constructor(
    private readonly eventStore: EventStore<UserEvent>,
    private readonly eventBus: EventBus<UserEvent>,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
    this.eventStore = eventStore
    this.eventBus = eventBus
    this.commandBus = commandBus
    this.queryBus = queryBus
    this.repository = new UserRepository(eventStore)
    this.database = new InMemoryDatabase()
  }

  registerModule(): void {
    new UserProjectionHandler(this.eventBus, this.database).start()
    this.commandBus.register('CreateUser', new CreateUserHandler(this.repository))
    this.commandBus.register('UpdateUserName', new UpdateUserNameHandler(this.repository))
    this.commandBus.register('ActivateUser', new ActivateUserHandler(this.repository))
    this.eventBus.subscribe(new UserCreatedEventHandler(this.eventStore))
    this.eventBus.subscribe(new ContractSignedHandler(this.commandBus))
    this.queryBus.register('GetUserByEmail', new GetUserByEmailHandler(this.database))
  }
};
