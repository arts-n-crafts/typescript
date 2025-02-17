import { describe, it, expect, beforeEach } from "vitest";
import { QueryBus } from "./QueryBus";
import { MockGetUserByEmailQuery, type MockGetUserByEmailQueryProps } from "./mocks/MockGetUserByEmailQuery";

describe("QueryBus", () => {
  let payload: MockGetUserByEmailQueryProps;

  beforeEach(() => {
    payload = { email: 'test' }
  })

  it('should be defined', () => {
    const bus = new QueryBus();
    expect(bus).toBeDefined();
  });

  it('should throw an error if the query handler is not registered', async () => {
    const query = new MockGetUserByEmailQuery(payload)
    const bus = new QueryBus();
    const promised = bus.execute(query)
    await expect(promised).rejects.toThrowError(`No handler found for query type: ${MockGetUserByEmailQuery.name}`);
  });
});
