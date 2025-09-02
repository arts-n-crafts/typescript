import type { GetUserByEmail } from '@core/examples/GetUserByEmail.ts'
import type { UserModel } from '@core/examples/UserProjection.ts'
import type { BaseEvent } from '@domain/BaseEvent.ts'
import type { UserCommand, UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { EventStore } from '@infrastructure/EventStore/EventStore.ts'
import type { CommandBus } from '../../CommandBus/CommandBus.ts'
import type { EventBus } from '../../EventBus/EventBus.ts'
import type { QueryBus } from '../../QueryBus/QueryBus.ts'
import { ActivateUserHandler } from '@core/examples/ActivateUserHandler.ts'
import { ContractSignedHandler } from '@core/examples/ContractSignedHandler.ts'
import { CreateUserHandler } from '@core/examples/CreateUserHandler.ts'
import { GetUserByEmailHandler } from '@core/examples/GetUserByEmailHandler.ts'
import { UpdateUserNameHandler } from '@core/examples/UpdateUserNameHandler.ts'
import { UserCreatedEventHandler } from '@core/examples/UserCreatedEventHandler.ts'
import { UserProjectionHandler } from '@core/examples/UserProjection.ts'
import { User } from '@domain/examples/User.ts'
import { SimpleDatabase } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import { SimpleRepository } from '@infrastructure/Repository/implementations/SimpleRepository.ts'

export class UserModule {
  private readonly database: Database<UserModel, Promise<void>, Promise<UserModel[]>>
  private readonly repository: Repository<UserEvent, Promise<UserState>, Promise<void>>

  constructor(
    eventStore: EventStore<UserEvent, Promise<void>, Promise<UserEvent[]>>,
    private readonly eventBus: EventBus<BaseEvent>,
    private readonly commandBus: CommandBus<UserCommand>,
    private readonly queryBus: QueryBus<GetUserByEmail, Promise<Record<string, unknown>[]>>,
  ) {
    this.repository = new SimpleRepository(eventStore, 'users', User.evolve, User.initialState)
    this.database = new SimpleDatabase()
  }

  registerModule(): void {
    new UserProjectionHandler(this.database).start(this.eventBus)
    new UserCreatedEventHandler(this.repository).start(this.eventBus)
    new ContractSignedHandler(this.commandBus).start(this.eventBus)

    this.commandBus.register('CreateUser', new CreateUserHandler(this.repository))
    this.commandBus.register('UpdateUserName', new UpdateUserNameHandler(this.repository))
    this.commandBus.register('ActivateUser', new ActivateUserHandler(this.repository))

    this.queryBus.register('GetUserByEmail', new GetUserByEmailHandler(this.database))
  }
};
