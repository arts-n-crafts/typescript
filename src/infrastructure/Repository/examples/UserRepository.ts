import type { Repository } from '../../../domain'
import type { UserEvent } from '../../../domain/examples/User.ts'
import { InMemoryRepository } from '../implementations/InMemoryRepository'

export class UserRepository
  extends InMemoryRepository<UserEvent>
  implements Repository<UserEvent> {
}
