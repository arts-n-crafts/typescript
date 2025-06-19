import type { Command } from './Command'

export type CommandHandlerResult = { id: string } | void

export interface ICommandHandler<TPayload> {
  execute: (aCommand: Command<string, TPayload>) => Promise<CommandHandlerResult>
}
