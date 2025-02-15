import { describe, it, expect } from "vitest";
import { MockUserByUsernameSpecification } from "./mocks/MockUserByUsernameSpecification";
import { MockUser } from "../AggregateRoot/mocks/MockUser";
import { Specification } from "./Specification";

describe('Base Specification', () => {
  it('should be defined', () => {
    expect(Specification).toBeDefined();
  });

  it('should be satisfied', () => {
    const candidate = 'John Doe'
    const specification = new MockUserByUsernameSpecification(candidate);
    const user = MockUser.create({ name: candidate, email: ''}, '123');
    expect(specification.isSatisfiedBy(user)).toBeTruthy();
  })
});
