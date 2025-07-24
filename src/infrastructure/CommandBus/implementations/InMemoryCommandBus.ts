import type { Command } from '@core/Command.ts'
import type { CommandHandler } from '@core/CommandHandler.ts'
import type { EventStoreResult } from '@infrastructure/EventStore/EventStore.ts'
import type { CommandBus } from '../CommandBus.ts'

export class InMemoryCommandBus implements CommandBus {
  private handlers: Map<string, CommandHandler> = new Map()

  register(aTypeOfCommand: string, anHandler: CommandHandler): void {
    if (this.handlers.has(aTypeOfCommand)) {
      throw new Error(`Handler already registered for command type: ${aTypeOfCommand}`)
    }
    this.handlers.set(aTypeOfCommand, anHandler)
  }

  async execute<TResult = EventStoreResult>(aCommand: Command): Promise<TResult> {
    const handler = this.handlers.get(aCommand.type)
    if (!handler) {
      throw new Error(`No handler found for command type: ${aCommand.type}`)
    }
    const result = await handler.execute(aCommand) as unknown as Promise<TResult>
    return result
  }
}
