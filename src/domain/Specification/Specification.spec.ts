import { describe, it, expect } from "vitest";
import { AndSpecification, Specification } from "./Specification";
import { MockUserByUsernameSpecification } from "./mocks/MockUserByUsernameSpecification";
import { MockUserByAgeSpecification } from "./mocks/MockUserByAgeSpecification";
import { MockUser } from "../AggregateRoot/mocks/MockUser";

describe('Specification', () => {
  it('should be defined', () => {
    expect(Specification).toBeDefined();
  });

  it('should create an AndSpecification', () => {
    const usernameSpec = new MockUserByUsernameSpecification('john_doe');
    const ageSpec = new MockUserByAgeSpecification(30);
    const andSpec = new AndSpecification(usernameSpec, ageSpec);
    const user = new MockUser({ name: 'john_doe', age: 30 });

    expect(andSpec.isSatisfiedBy(user)).toBe(true);
  });
});
