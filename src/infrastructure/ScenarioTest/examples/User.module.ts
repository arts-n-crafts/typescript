import type { Module } from '@core/Module.interface.ts'
import type { UserEvent } from '@domain/examples/User.ts'
import type { CommandBus } from '../../CommandBus/CommandBus.ts'
import type { Database } from '../../Database/Database.ts'
import type { EventBus } from '../../EventBus/EventBus.ts'
import type { EventStore } from '../../EventStore/EventStore.ts'
import type { QueryBus } from '../../QueryBus/QueryBus.ts'
import { ActivateUserHandler } from '@core/examples/ActivateUserHandler.ts'
import { ContractSignedHandler } from '@core/examples/ContractSignedHandler.ts'
import { CreateUserHandler } from '@core/examples/CreateUserHandler.ts'
import { GetUserByEmailHandler } from '@core/examples/GetUserByEmailHandler.ts'
import { UpdateUserNameHandler } from '@core/examples/UpdateUserNameHandler.ts'
import { UserCreatedEventHandler } from '@core/examples/UserCreatedEventHandler.ts'
import { UserProjectionHandler } from '@core/examples/UserProjection.ts'
import { InMemoryDatabase } from '../../Database/implementations/InMemoryDatabase.ts'
import { UserRepository } from '../../Repository/examples/UserRepository.ts'

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
