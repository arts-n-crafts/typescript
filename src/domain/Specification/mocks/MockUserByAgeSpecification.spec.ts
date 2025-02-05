import { describe, expect, it } from "vitest";
import { MockUserByAgeSpecification } from "./MockUserByAgeSpecification";
import { MockUser } from "../../AggregateRoot/mocks/MockUser";

describe('MockUserByAgeSpecification', () => {
  it('should be defined', () => {
    expect(MockUserByAgeSpecification).toBeDefined();
  })

  it('should return true if the age is the same', () => {
    const spec = new MockUserByAgeSpecification(30);
    const user = MockUser.create({ username: 'test', email: '', age: 30}, '123')
    expect(spec.isSatisfiedBy(user)).toBe(true);
  });

  it('should return false if the age is not the same', () => {
    const spec = new MockUserByAgeSpecification(30);
    const user = MockUser.create({ username: 'test', email: '', age: 31}, '123')
    expect(spec.isSatisfiedBy(user)).toBe(false);
  });
});
