
import { describe, expect, it } from "vitest";
import { MockUser } from "../../AggregateRoot/mocks/MockUser";
import { MockUserByEmailSpecification } from "./MockUserByEmailSpecification";

describe('MockUserByEmailSpecification', () => {
  const candidate = 'elon@x.com';
  const specification = new MockUserByEmailSpecification(candidate);

  it('should be defined', () => {
    expect(MockUserByEmailSpecification).toBeDefined();
  })

  it('should return true if the email is the same', () => {
    const user = MockUser.create({ name: 'test', email: candidate, age: 30}, '123')
    expect(specification.isSatisfiedBy(user)).toBe(true);
  });

  it('should return false if the email is not the same', () => {
    const user = MockUser.create({ name: 'test', email: 'musk@x.com', age: 31}, '123')
    expect(specification.isSatisfiedBy(user)).toBe(false);
  });

  it('should return the correct filter for lookups', () => {
    const query = specification.toQuery();
    expect(query).toStrictEqual([{ email: candidate }])
  });
});
