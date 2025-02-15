import { describe, it, expect } from "vitest";
import { MockUserByUsernameSpecification } from "./mocks/MockUserByUsernameSpecification";
import { MockUserByAgeSpecification } from "./mocks/MockUserByAgeSpecification";
import { MockUser } from "../AggregateRoot/mocks/MockUser";
import { OrSpecification } from "./OrSpecification";

describe('OrSpecification', () => {
  it('should be defined', () => {
    expect(OrSpecification).toBeDefined();
  })

  it.each([
    {_scenario: 'VALID_USERNAME', username: 'elon_musk', age: 32},
    {_scenario: 'VALID_AGE', username: 'elon', age: 30}
  ])('should satisfy the OrSpecification ($_scenario)', ({username, age}) => {
    const usernameSpec = new MockUserByUsernameSpecification(username);
    const ageSpec = new MockUserByAgeSpecification(age);
    const orSpec = new OrSpecification(usernameSpec, ageSpec);
    const user = MockUser.create({ name: username, email: 'elon@x.com', age }, '123');
    expect(orSpec.isSatisfiedBy(user)).toBe(true);
  });

  it.each([
    {_scenario: 'INVALID_USERNAME_AND_AGE', username: 'elon', age: 32},
  ])('should not satisfy the OrSpecification ($_scenario)', ({ username, age }) => {
    const usernameSpec = new MockUserByUsernameSpecification('elon_musk');
    const ageSpec = new MockUserByAgeSpecification(30);
    const andSpec = new OrSpecification(usernameSpec, ageSpec);
    const user = MockUser.create({ name: username, email: 'elon@x.com', age }, '123');
    expect(andSpec.isSatisfiedBy(user)).toBe(false);
  });
  
  it('should return a flat OrSpecification', () => {
    const username = 'elon_musk';
    const age = 30;
    const usernameSpec = new MockUserByUsernameSpecification(username);
    const ageSpec = new MockUserByAgeSpecification(age);
    const andSpec = new OrSpecification(usernameSpec, ageSpec);
    expect(andSpec.toQuery()).toStrictEqual([
      usernameSpec.toQuery(),
      ageSpec.toQuery()
    ].flat());
  });
});
