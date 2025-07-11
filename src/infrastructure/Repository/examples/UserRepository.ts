import type { User, UserCommand, UserEvent } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import { InMemoryRepository } from '../implementations/InMemoryRepository.ts'

export class UserRepository
  extends InMemoryRepository<ReturnType<typeof User['initialState']>, UserCommand, UserEvent>
  implements Repository {
}
