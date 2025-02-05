import { describe, it, expect } from "vitest";
import { Repository } from "./Repository";
import { MockRepository } from "./mocks/MockRepository";

describe('Repository', () => {
  it('should be defined', () => {
    expect(Repository).toBeDefined();
  })

  it('should have a find, load and store method', () => {
    const repository = new MockRepository();
    expect(repository.find).toBeDefined();
    expect(repository.load).toBeDefined();
    expect(repository.store).toBeDefined();
  });
});
