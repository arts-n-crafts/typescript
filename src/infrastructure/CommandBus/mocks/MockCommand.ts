import { Command } from "../Command";

export interface MockCommandProps {
  name: string;
}

export class MockCommand extends Command<MockCommandProps> { }
