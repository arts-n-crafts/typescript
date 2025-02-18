import { describe, it, expect, beforeEach } from "vitest";
import { randomUUID } from "crypto";
import { QueryBus } from "./QueryBus";
import { MockGetUserByEmailQuery, type MockGetUserByEmailQueryProps } from "./mocks/MockGetUserByEmailQuery";
import { MockGetUserByEmailQueryHandler, type MockGetUserByEmailQueryResult } from "./mocks/MockGetUserByEmailQueryHandler";
import { InMemoryDatabase } from "../Database/implementations/InMemoryDatabase";
import { Operation } from "../Database/Database";

describe("QueryBus", () => {
  const store = 'users';
  let database: InMemoryDatabase;
  let user: { id: string, email: string };
  let payload: MockGetUserByEmailQueryProps;

  beforeEach(async () => {
    database = new InMemoryDatabase();
    user = { id: randomUUID(), email: "elon@x.com" }
    await database.execute(store, { operation: Operation.CREATE, payload: user });
    payload = { email: user.email };
  });

  it('should be defined', () => {
    const bus = new QueryBus();
    expect(bus).toBeDefined();
  });

  it('should be able to register a handler', () => {
    const bus = new QueryBus();
    const handler = new MockGetUserByEmailQueryHandler(database);
    expect(bus.register(MockGetUserByEmailQuery, handler)).toBeUndefined()
  });

  it('should throw an error if the query handler is already registered', () => {
    const bus = new QueryBus();
    const handler = new MockGetUserByEmailQueryHandler(database);

    bus.register(MockGetUserByEmailQuery, handler);

    expect(() => bus.register(MockGetUserByEmailQuery, handler)).toThrow(`Handler already registered for query type: ${MockGetUserByEmailQuery.name}`);
  });

  it('should throw an error if the query handler is not registered', async () => {
    const query = new MockGetUserByEmailQuery(payload)
    const bus = new QueryBus();
    const promised = bus.execute(query)
    await expect(promised).rejects.toThrowError(`No handler found for query type: ${MockGetUserByEmailQuery.name}`);
  });
});
