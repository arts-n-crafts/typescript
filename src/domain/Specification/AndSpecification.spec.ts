import { describe, it, expect } from "vitest";
import { MockUserByUsernameSpecification } from "./mocks/MockUserByUsernameSpecification";
import { MockUserByAgeSpecification } from "./mocks/MockUserByAgeSpecification";
import { AndSpecification } from "./AndSpecification";
import { MockUser } from "../AggregateRoot/mocks/MockUser";

describe('AndSpecification', () => {
  it('should be defined', () => {
    expect(AndSpecification).toBeDefined();
  })

  it('should satisfy the AndSpecification', () => {
    const username = 'elon_musk';
    const age = 30;

    const usernameSpec = new MockUserByUsernameSpecification(username);
    const ageSpec = new MockUserByAgeSpecification(age);
    const andSpec = new AndSpecification(usernameSpec, ageSpec);
    const user = MockUser.create({
      name: username,
      email: 'elon@x.com',
      age
    }, '123');

    expect(andSpec.isSatisfiedBy(user)).toBe(true);
  });

  it.each([
    {_scenario: 'INVALID_USERNAME', username: 'elon', age: 30},
    {_scenario: 'INVALID_AGE', username: 'elon_musk', age: 31}
  ])('should not satisfy the AndSpecification ($_scenario)', ({ username, age }) => {
    const usernameSpec = new MockUserByUsernameSpecification('elon_musk');
    const ageSpec = new MockUserByAgeSpecification(30);
    const andSpec = new AndSpecification(usernameSpec, ageSpec);
    const user = MockUser.create({ name: username, email: 'elon@x.com', age }, '123');
    expect(andSpec.isSatisfiedBy(user)).toBe(false);
  });

  it('should return a flat AndSpecification', () => {
    const username = 'elon_musk';
    const age = 30;
    const usernameSpec = new MockUserByUsernameSpecification(username);
    const ageSpec = new MockUserByAgeSpecification(age);
    const andSpec = new AndSpecification(usernameSpec, ageSpec);
    expect(andSpec.toQuery()).toStrictEqual([
      usernameSpec.toQuery(),
      ageSpec.toQuery()
    ].flat());
  });
});
