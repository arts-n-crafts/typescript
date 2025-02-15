import { describe, expect, it } from "vitest";
import { MockUserByUsernameSpecification } from "./MockUserByUsernameSpecification";
import { MockUser } from "../../AggregateRoot/mocks/MockUser";

describe('MockUserByUsernameSpecification', () => {
  const candidate = 'test'
  const specification = new MockUserByUsernameSpecification(candidate);
  
  it('should be defined', () => {
    expect(MockUserByUsernameSpecification).toBeDefined();
  });

  it('should return true if the username is the same', () => {
    const user = MockUser.create({ name: candidate, email: ''}, '123')
    expect(specification.isSatisfiedBy(user)).toBe(true);
  });

  it('should return false if the username is not the same', () => {
    const user = MockUser.create({ name: 'test2', email: ''}, '123')
    expect(specification.isSatisfiedBy(user)).toBe(false);
  });
  
  it('should return the correct filter for lookups', () => {
    const query = specification.toQuery();
    expect(query).toStrictEqual([{ name: candidate }])
  });
});
