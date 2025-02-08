import { Command } from "../Command";

export interface MockUpdateUserNameCommandProps {
  name: string;
}

export class MockUpdateUserNameCommand extends Command<MockUpdateUserNameCommandProps> { }
