import type { FilledArray } from '../../../core/types/FilledArray'
import type { MockUser } from '../../AggregateRoot/mocks/MockUser'
import type { Specification } from '../Specification'

export class MockUserByAgeSpecification implements Specification<MockUser> {
  constructor(
    private age: number,
  ) {}

  isSatisfiedBy(candidate: MockUser) {
    return candidate.props.age === this.age
  }

  toQuery(): FilledArray {
    return [{ age: this.age }]
  }
}
