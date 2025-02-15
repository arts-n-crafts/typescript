import type { FilledArray } from "../../../core/types/FilledArray";
import type { MockUser } from "../../AggregateRoot/mocks/MockUser";
import type { Specification } from "../Specification";

export class MockUserByUsernameSpecification implements Specification<MockUser> {
  constructor(
    private username: string
  ) {}

  isSatisfiedBy(candidate: MockUser) {
    return candidate.props.name === this.username;
  }

  toQuery(): FilledArray {
    return [{ name: this.username }]
  }
}
