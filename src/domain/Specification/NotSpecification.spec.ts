import { describe, it, expect } from "vitest";
import { NotSpecification } from "./NotSpecification";
import { MockUserByUsernameSpecification } from "./mocks/MockUserByUsernameSpecification";
import { MockUser } from "../AggregateRoot/mocks/MockUser";

describe('NotSpecification', () => {
  it('should be defined', () => {
    expect(NotSpecification).toBeDefined();
  });

  it.each([
    {_scenario: 'VALID_USERNAME', username: 'elon_musk', age: 32},
  ])('should not satisfy the NotSpecification ($_scenario)', ({username, age}) => {
    const usernameSpec = new MockUserByUsernameSpecification(username);
    const notSpec = new NotSpecification(usernameSpec);
    const user = MockUser.create({ name: username, email: 'elon@x.com', age }, '123');
    expect(notSpec.isSatisfiedBy(user)).toBe(false);
  });

  it.each([
    {_scenario: 'INVALID_USERNAME', username: 'elon', age: 32},
  ])('should satisfy the NotSpecification ($_scenario)', ({ username, age }) => {
    const usernameSpec = new MockUserByUsernameSpecification('elon_musk');
    const notSpec = new NotSpecification(usernameSpec);
    const user = MockUser.create({ name: username, email: 'elon@x.com', age }, '123');
    expect(notSpec.isSatisfiedBy(user)).toBe(true);
  });
});
