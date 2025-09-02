import type { EventHandler } from '@core/EventHandler.ts'
import type { UserCommand } from '@domain/examples/User.ts'
import type { CommandBus } from '@infrastructure/CommandBus/CommandBus.ts'
import type { EventBus } from '@infrastructure/EventBus/EventBus.ts'
import type { ContractSignedEvent } from '@infrastructure/EventBus/examples/ContractSigned.ts'
import { createActivateUserCommand } from '@core/examples/ActivateUser.ts'

export class ContractSignedHandler implements EventHandler<ContractSignedEvent, Promise<void>> {
  constructor(
    private readonly commandBus: CommandBus<UserCommand, Promise<void>>,
  ) { }

  start(eventBus: EventBus<ContractSignedEvent>): void {
    eventBus.subscribe('ContractSigned', this)
  }

  async handle(anEvent: ContractSignedEvent): Promise<void> {
    const command = createActivateUserCommand(anEvent.payload.userId, {})
    await this.commandBus.execute(command)
  }
}
