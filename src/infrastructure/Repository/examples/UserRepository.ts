import type { UserEvent } from '@domain/examples/User.ts'
import type { Repository } from '@domain/Repository.ts'
import { InMemoryRepository } from '../implementations/InMemoryRepository.ts'

export class UserRepository
  extends InMemoryRepository<UserEvent>
  implements Repository<UserEvent> {
  readonly stream = 'user'
}
