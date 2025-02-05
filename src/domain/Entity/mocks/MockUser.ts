import { Entity } from "../Entity";

interface MockUserProps {
  username: string;
  email: string;
}

export class MockUser extends Entity<MockUserProps> {
  static create(props: MockUserProps, id: string) {
    return new MockUser(props, id);
  }
}
