import type { Command } from '@core/Command.ts'

export type CommandHandlerResult = { id: string } | void

export interface CommandHandler<TType = string, TPayload = unknown> {
  execute: <TReturn = CommandHandlerResult>(aCommand: Command<TType, TPayload>) => Promise<TReturn>
}
