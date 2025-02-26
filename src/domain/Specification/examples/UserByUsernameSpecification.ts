import type { FilledArray } from '../../../core/types/FilledArray'
import type { User } from '../../AggregateRoot/examples/User'
import type { Specification } from '../Specification'

export class UserByUsernameSpecification implements Specification<User> {
  constructor(
    private username: string,
  ) {}

  isSatisfiedBy(candidate: User) {
    return candidate.props.name === this.username
  }

  toQuery(): FilledArray {
    return [{ name: this.username }]
  }
}
