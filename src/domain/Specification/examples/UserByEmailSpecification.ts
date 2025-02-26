import type { FilledArray } from '../../../core/types/FilledArray'
import type { User } from '../../AggregateRoot/examples/User'
import type { Specification } from '../Specification'

export class UserByEmailSpecification implements Specification<User> {
  constructor(
    private email: string,
  ) {}

  isSatisfiedBy(candidate: User) {
    return candidate.props.email === this.email
  }

  toQuery(): FilledArray {
    return [{ email: this.email }]
  }
}
