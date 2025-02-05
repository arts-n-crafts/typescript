import { describe, expect, it } from "vitest";
import { MockUserByAgeSpecification } from "./MockUserByAgeSpecification";

describe('MockUserByAgeSpecification', () => {
  it('should be defined', () => {
    expect(MockUserByAgeSpecification).toBeDefined();
  })
  
  it('should return true if the age is the same', () => {
    const spec = new MockUserByAgeSpecification(30);
    const user = { age: 30 };
    expect(spec.isSatisfiedBy(user)).toBe(true);
  });
  
  it('should return false if the age is not the same', () => {
    const spec = new MockUserByAgeSpecification(30);
    const user = { age: 31 };
    expect(spec.isSatisfiedBy(user)).toBe(false);
  });
});
