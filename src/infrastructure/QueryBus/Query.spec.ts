import { describe, it, expect, beforeEach } from "vitest";
import { MockQuery, type MockQueryProps } from "./mocks/MockQuery";
import { Query, type QueryMetadata } from "./Query";

describe('Query', () => {
  let payload: MockQueryProps;
  let timestamp: Date;
  let metadata: QueryMetadata;

  beforeEach(() => {
    payload = { name: 'test' }
    timestamp = new Date()
    metadata = { timestamp }
  })

  it('should be defined', () => {
    expect(Query).toBeDefined();
  })

  it('should create an instance', () => {
    const query = new MockQuery(payload, metadata);
    expect(query).toBeInstanceOf(MockQuery);
  });

  it('should contain the valid information', () => {
    const query = new MockQuery(payload, metadata);
    expect(query.payload.name).toBe('test');
    expect(query.metadata?.timestamp).toBe(timestamp);
  });
});
