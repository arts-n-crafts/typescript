import { describe, expect, it } from "vitest";
import { MockUserByUsernameSpecification } from "./MockUserByUsernameSpecification";
import { MockUser } from "../../AggregateRoot/mocks/MockUser";

describe('MockUserByUsernameSpecification', () => {
  it('should be defined', () => {
    expect(MockUserByUsernameSpecification).toBeDefined();
  });

  it('should return true if the username is the same', () => {
    const spec = new MockUserByUsernameSpecification('test');
    const user = MockUser.create({ name: 'test', email: ''}, '123')
    expect(spec.isSatisfiedBy(user)).toBe(true);
  });

  it('should return false if the username is not the same', () => {
    const spec = new MockUserByUsernameSpecification('test');
    const user = MockUser.create({ name: 'test2', email: ''}, '123')
    expect(spec.isSatisfiedBy(user)).toBe(false);
  });
});
