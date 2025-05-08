import type { Module } from '../../../core/Module.interface'
import type { CommandBus } from '../../CommandBus/CommandBus'
import type { Database } from '../../Database/Database'
import type { EventBus } from '../../EventBus/EventBus'
import type { EventStore } from '../../EventStore/EventStore'
import type { QueryBus } from '../../QueryBus/QueryBus'
import { ActivateUserCommand } from '../../CommandBus/examples/ActivateUserCommand'
import { ActivateUserCommandHandler } from '../../CommandBus/examples/ActivateUserCommandHandler'
import { CreateUserCommand } from '../../CommandBus/examples/CreateUserCommand'
import { CreateUserCommandHandler } from '../../CommandBus/examples/CreateUserCommandHandler'
import { UpdateUserNameCommand } from '../../CommandBus/examples/UpdateUserNameCommand'
import { UpdateUserNameCommandHandler } from '../../CommandBus/examples/UpdateUserNameCommandHandler'
import { InMemoryDatabase } from '../../Database/implementations/InMemoryDatabase'
import { ContractSignedEventHandler } from '../../EventBus/examples/ContractSignedEventHandler'
import { UserCreatedEventHandler } from '../../EventBus/examples/UserCreatedEventHandler'
import { UserProjectionHandler } from '../../ProjectionHandler/examples/UserProjection'
import { GetUserByEmailQuery } from '../../QueryBus/examples/GetUserByEmailQuery'
import { GetUserByEmailQueryHandler } from '../../QueryBus/examples/GetUserByEmailQueryHandler'
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
    this.commandBus.register(CreateUserCommand, new CreateUserCommandHandler(this.repository))
    this.commandBus.register(UpdateUserNameCommand, new UpdateUserNameCommandHandler(this.repository))
    this.commandBus.register(ActivateUserCommand, new ActivateUserCommandHandler(this.repository))
    this.eventBus.subscribe(new UserCreatedEventHandler(this.eventStore))
    this.eventBus.subscribe(new ContractSignedEventHandler(this.commandBus))
    this.queryBus.register(GetUserByEmailQuery, new GetUserByEmailQueryHandler(this.database))
  }
};
