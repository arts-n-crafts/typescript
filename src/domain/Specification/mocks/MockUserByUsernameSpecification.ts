import type { MockUser } from "../../AggregateRoot/mocks/MockUser";
import type { Specification } from "../Specification";

export class MockUserByUsernameSpecification implements Specification<MockUser> {
  constructor(
    private username: string
  ) {}

  isSatisfiedBy(candidate: MockUser) {
    return candidate.props.name === this.username;
  }
  
  toQuery(..._args: unknown[]): string {
    throw new Error("Method not implemented.");
  }
}
