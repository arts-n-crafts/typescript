import type { MockUser } from "../../AggregateRoot/mocks/MockUser";
import type { ISpecification } from "../Specification";

export class MockUserByUsernameSpecification implements ISpecification<MockUser> {
  constructor(
    private username: string
  ) {}

  isSatisfiedBy(candidate: MockUser) {
    return candidate.username === this.username;
  }
}
