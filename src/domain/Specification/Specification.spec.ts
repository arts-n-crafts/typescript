import { describe, it, expect } from "vitest";
import { MockUserByUsernameSpecification } from "./mocks/MockUserByUsernameSpecification";
import { MockUser } from "../AggregateRoot/mocks/MockUser";
import { Specification } from "./Specification";

describe('Base Specification', () => {
  const candidate = 'John Doe'
  const specification = new MockUserByUsernameSpecification(candidate);

  it('should be defined', () => {
    expect(Specification).toBeDefined();
  });

  it('should be satisfied', () => {
    const user = MockUser.create({ name: candidate, email: ''}, '123');
    expect(specification.isSatisfiedBy(user)).toBeTruthy();
  })

  it('should return the correct filter for lookups', () => {
    const query = specification.toQuery();
    expect(query).toStrictEqual([{ name: candidate }])
  });
});
