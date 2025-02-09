import { Command } from "../Command";

export interface MockUpdateUserNameCommandProps {
  aggregateId: string;
  name: string;
}

export class MockUpdateUserNameCommand extends Command<MockUpdateUserNameCommandProps> { }
