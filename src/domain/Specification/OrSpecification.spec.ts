import { describe, it, expect } from "vitest";
import { MockUserByUsernameSpecification } from "./mocks/MockUserByUsernameSpecification";
import { MockUserByAgeSpecification } from "./mocks/MockUserByAgeSpecification";
import { MockUser } from "../AggregateRoot/mocks/MockUser";
import { OrSpecification } from "./OrSpecification";

describe('OrSpecification', () => {
  it('should be defined', () => {
    expect(OrSpecification).toBeDefined();
  })

  it.skip('should satisfy the OrSpecification', () => {
    const username = 'elon_musk';
    const age = 30;

    const usernameSpec = new MockUserByUsernameSpecification(username);
    const ageSpec = new MockUserByAgeSpecification(age);
    const andSpec = new OrSpecification(usernameSpec, ageSpec);
    const user = MockUser.create({
      username,
      email: 'elon@x.com',
      age
    }, '123');

    expect(andSpec.isSatisfiedBy(user)).toBe(true);
  });

  it.skip.each([
    {_scenario: 'INVALID_USERNAME', username: 'elon', age: 30},
    {_scenario: 'INVALID_AGE', username: 'elon_musk', age: 31}
  ])('should not satisfy the OrSpecification ($_scenario)', ({ username, age }) => {
    const usernameSpec = new MockUserByUsernameSpecification('elon_musk');
    const ageSpec = new MockUserByAgeSpecification(30);
    const andSpec = new OrSpecification(usernameSpec, ageSpec);
    const user = MockUser.create({ username, email: 'elon@x.com', age }, '123');
    expect(andSpec.isSatisfiedBy(user)).toBe(false);
  });
});
