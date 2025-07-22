import type { User, UserCommand, UserEvent, UserState } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import { GenericRepository } from '../implementations/GenericRepository.ts'

export class UserRepository
  extends GenericRepository<ReturnType<typeof User['initialState']>, UserCommand, UserEvent>
  implements Repository<UserState, UserEvent> {
}
