import { describe, it, expect } from "vitest";
import { QueryBus } from "./QueryBus";

describe("QueryBus", () => {
  it('should be defined', () => {
    const bus = new QueryBus();
    expect(bus).toBeDefined();
  });
});
