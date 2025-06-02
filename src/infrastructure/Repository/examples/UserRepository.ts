import type { IRepository } from '../../../domain'
import type { User } from '../../../domain/AggregateRoot/examples/User'
import { InMemoryRepository } from '../implementations/InMemoryRepository'

export class UserRepository
  extends InMemoryRepository<User, User['props']>
  implements IRepository<User> {
}
