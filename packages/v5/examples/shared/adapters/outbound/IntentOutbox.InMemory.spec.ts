import { InMemoryIntentOutbox } from "./IntentOutbox.InMemory.ts";

describe("in-memory intent outbox", () => {
  it("should be defined", () => {
    expect(InMemoryIntentOutbox).toBeDefined();
  });
});
