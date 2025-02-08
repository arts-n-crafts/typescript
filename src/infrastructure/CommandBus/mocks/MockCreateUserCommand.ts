import { Command } from "../Command";

export interface MockCreateUserCommandProps {
  name: string;
  email: string;
  age?: number;
}

export class MockCreateUserCommand extends Command<MockCreateUserCommandProps> { }
