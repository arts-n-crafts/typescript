import type { MockUser } from "../../AggregateRoot/mocks/MockUser";
import type { ISpecification } from "../Specification";

export class MockUserByAgeSpecification implements ISpecification<MockUser> {
  constructor(
    private age: number
  ) {}

  isSatisfiedBy(candidate: MockUser) {
    return candidate.age === this.age;
  }
}
