import { describe, expect, it } from "vitest";
import { MockUser } from "./mocks/MockUser";

describe('MockUser', () => {
  it('should be defined', () => {
    expect(MockUser).toBeDefined();
  });

  it('should succeed to create a MockUser', () => {
    const id = '123';
    const props = {
      username: 'elon',
      email: 'elon@x.com',
    }
    const mockUser = new MockUser(props, id);
    expect(mockUser).toBeInstanceOf(MockUser);
    expect(mockUser.id).toBe(id);
    expect(mockUser.props).toEqual(props);
  });

  it('should succeed to compare two MockUsers', () => {
    const id = '123';
    const props = { username: 'elon', email: 'elon@x.com', };
    const mockUser1 = new MockUser(props, id);
    const mockUser2 = new MockUser(props, id);
    expect(mockUser1.equals(mockUser2)).toBe(true);
  });

  it('should fail to compare two MockUsers', () => {
    const id = '123';
    const props = { username: 'elon', email: 'elon@x.com', };
    const mockUser1 = new MockUser(props, id);
    const mockUser2 = new MockUser(props, '124');
    expect(mockUser1.equals(mockUser2)).toBe(false);
  });
});
