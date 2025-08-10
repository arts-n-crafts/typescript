import type { EventHandler } from '@core/EventHandler.ts'
import type { CommandBus } from '@infrastructure/CommandBus/CommandBus.ts'
import type { ContractSigned } from '@infrastructure/EventBus/examples/ContractSigned.ts'
import { createActivateUserCommand } from '@core/examples/ActivateUser.ts'

type ContractSignedEvent = ReturnType<typeof ContractSigned>

export class ContractSignedHandler implements EventHandler {
  constructor(
    private readonly commandBus: CommandBus,
  ) { }

  async handle(anEvent: ContractSignedEvent): Promise<void> {
    const command = createActivateUserCommand(anEvent.payload.userId, {})
    await this.commandBus.execute(command)
  }
}
