import type { EventHandler } from '@core/EventHandler.ts'
import type { BaseEvent } from '@domain/BaseEvent.js'
import type { UserCommand } from '@domain/examples/User.ts'
import type { CommandBus } from '@infrastructure/CommandBus/CommandBus.ts'
import type { ContractSignedEvent } from '@infrastructure/EventBus/examples/ContractSigned.ts'
import { createActivateUserCommand } from '@core/examples/ActivateUser.ts'

export class ContractSignedHandler implements EventHandler<ContractSignedEvent, Promise<void>> {
  constructor(
    private readonly commandBus: CommandBus<UserCommand, Promise<void>>,
  ) { }

  isContractSignedEvent(anEvent: BaseEvent): anEvent is ContractSignedEvent {
    return anEvent.type === 'ContractSigned'
  }

  async handle(anEvent: BaseEvent): Promise<void> {
    if (this.isContractSignedEvent(anEvent)) {
      const command = createActivateUserCommand(anEvent.payload.userId, {})
      await this.commandBus.execute(command)
    }
  }
}
