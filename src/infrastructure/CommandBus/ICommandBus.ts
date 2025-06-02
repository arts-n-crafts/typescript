import type { Command } from './Command'
import type { CommandHandlerResult, ICommandHandler } from './ICommandHandler'

export interface ICommandBus {
  register: (aTypeOfCommand: string, anHandler: ICommandHandler<any>) => void
  execute: (aCommand: Command) => Promise<CommandHandlerResult>
}
