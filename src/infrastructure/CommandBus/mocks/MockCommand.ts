import { Command, type CommandMetadata, type ICommand } from "../Command";

export interface MockCommandProps {
  name: string;
}

export interface MockCommandMetadata extends CommandMetadata {
  timestamp: Date
}

export class MockCommand extends Command<
  MockCommandProps,
  MockCommandMetadata
> implements ICommand { }
