import type { FilledArray } from '../../../core/types/FilledArray'
import type { User } from '../../AggregateRoot/examples/User'
import type { Specification } from '../Specification'

export class UserByAgeSpecification implements Specification<User> {
  constructor(
    private age: number,
  ) {}

  isSatisfiedBy(candidate: User) {
    return candidate.props.age === this.age
  }

  toQuery(): FilledArray {
    return [{ age: this.age }]
  }
}
