import { describe, it, expect, beforeEach } from "vitest";
import { MockGetUserByEmailQuery, type MockGetUserByEmailQueryProps } from "./mocks/MockGetUserByEmailQuery";
import { Query } from "./Query";

describe('Query', () => {
  let payload: MockGetUserByEmailQueryProps;

  beforeEach(() => {
    payload = { email: 'test' }
  })

  it('should be defined', () => {
    expect(Query).toBeDefined();
  })

  it('should create an instance', () => {
    const query = new MockGetUserByEmailQuery(payload);
    expect(query).toBeInstanceOf(MockGetUserByEmailQuery);
  });

  it('should contain the valid information', () => {
    const query = new MockGetUserByEmailQuery(payload);
    expect(query.payload.email).toBe('test');
  });
});
