import type { FilledArray } from "../../../core/types/FilledArray";
import type { MockUser } from "../../AggregateRoot/mocks/MockUser";
import type { Specification } from "../Specification";

export class MockUserByEmailSpecification implements Specification<MockUser> {
  constructor(
    private email: string
  ) {}

  isSatisfiedBy(candidate: MockUser) {
    return candidate.props.email === this.email;
  }

  toQuery(): FilledArray {
    return [{ email: this.email }]
  }
}
