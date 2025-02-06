import { describe, it, expect } from "vitest";
import { MockRepository } from "./mocks/MockRepository";

describe('Repository', () => {
  it('should be defined', () => {
    expect(MockRepository).toBeDefined();
  })

  it('should be able to load all events of an aggregate', () => {
    const repository = new MockRepository();
    expect(repository.load).toBeDefined();
  });

  it('should be able to store a new event from an aggregate', () => {
    const repository = new MockRepository();
    expect(repository.store).toBeDefined();
  });
});
