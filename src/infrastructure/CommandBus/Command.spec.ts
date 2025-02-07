import { describe, it, expect, beforeEach } from "vitest";
import { MockCommand, type MockCommandProps } from "./mocks/MockCommand";
import { Command, type CommandMetadata } from "./Command";

describe('Command', () => {
  let payload: MockCommandProps;
  let timestamp: Date;
  let metadata: CommandMetadata;

  beforeEach(() => {
    payload = { name: 'test' }
    timestamp = new Date()
    metadata = { timestamp }
  })

  it('should be defined', () => { 
    expect(Command).toBeDefined();
  })
  
  it('should create an instance', () => {
    const command = new MockCommand(payload, metadata);
    expect(command).toBeInstanceOf(MockCommand);
  });

  it('should contain the valid information', () => {
    const command = new MockCommand(payload, metadata);
    expect(command.payload.name).toBe('test');
    expect(command.metadata?.timestamp).toBe(timestamp);
  });
});
