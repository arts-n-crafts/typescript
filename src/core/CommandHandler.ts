import type { Command } from '../domain'

export type CommandHandlerResult = { id: string } | void

export interface CommandHandler<TType, TPayload> {
  execute: (aCommand: Command<TType, TPayload>) => Promise<CommandHandlerResult>
}
