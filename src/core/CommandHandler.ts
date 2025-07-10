import type { Command } from '@core/Command.ts'

export type CommandHandlerResult = { id: string } | void

export interface CommandHandler<TType, TPayload> {
  execute: (aCommand: Command<TType, TPayload>) => Promise<CommandHandlerResult>
}
