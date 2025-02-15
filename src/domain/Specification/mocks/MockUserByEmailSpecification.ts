import type { MockUser } from "../../AggregateRoot/mocks/MockUser";
import type { Specification } from "../Specification";

export class MockUserByEmailSpecification implements Specification<MockUser> {
  constructor(
    private email: string
  ) {}

  isSatisfiedBy(candidate: MockUser) {
    return candidate.props.email === this.email;
  }

  toQuery(): Array<Record<string, unknown>> {
    return [{ email: this.email }]
  }
}
