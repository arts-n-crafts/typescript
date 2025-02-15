import { describe, it, expect, beforeEach } from "vitest";
import { randomUUID } from "crypto";
import { QueryHandler } from "./QueryHandler";
import { MockGetUserByEmailQuery } from "./mocks/MockGetUserByEmailQuery";
import { MockGetUserByEmailQueryHandler } from "./mocks/MockGetUserByEmailQueryHandler";
import { InMemoryDatabase } from "../Database/implementations/InMemoryDatabase";
import { Operation } from "../Database/Database";

describe("QueryHandler", () => {
  const store = 'users';
  let database: InMemoryDatabase;
  let user: { id: string, email: string };

  beforeEach(async () => {
    database = new InMemoryDatabase();
    user = { id: randomUUID(), email: "elon@x.com" }
    await database.execute(store, { operation: Operation.CREATE, payload: user });
  });

  it('should be defined', () => {
    expect(QueryHandler).toBeDefined();
  });

  it('should return the requested data', async () => {
    const query = new MockGetUserByEmailQuery({email: user.email});
    const handler = new MockGetUserByEmailQueryHandler(database)

    const results = await handler.execute(query);
    expect(results[0]?.id).toEqual(user.id);
    expect(results).toHaveLength(1);
  });
});
