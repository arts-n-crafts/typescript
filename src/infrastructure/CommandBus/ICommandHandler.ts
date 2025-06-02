import type { Command } from './Command'

export type CommandHandlerResult = { id: string } | void

export interface ICommandHandler<TPayload = object> {
  execute: (aCommand: Command<TPayload>) => Promise<CommandHandlerResult>
}
