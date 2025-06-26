import type { EventHandler } from '@core/EventHandler.ts'
import type { CommandBus } from '@infrastructure/CommandBus/CommandBus.ts'
import type { ContractSigned, ContractSignedPayload } from '@infrastructure/EventBus/examples/ContractSigned.ts'
import type { IntegrationEvent } from '@infrastructure/EventBus/IntegrationEvent.ts'
import { ActivateUser } from '@domain/examples/ActivateUser.ts'

type ContractSignedEvent = ReturnType<typeof ContractSigned>

export class ContractSignedHandler implements EventHandler<ContractSignedEvent> {
  constructor(
    private readonly commandBus: CommandBus,
  ) { }

  async handle(anEvent: IntegrationEvent<ContractSignedPayload>): Promise<void> {
    const command = ActivateUser(anEvent.payload.userId, {})
    await this.commandBus.execute(command)
  }
}
