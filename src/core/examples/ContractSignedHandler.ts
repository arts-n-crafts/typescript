import type { EventHandler } from '@core/EventHandler.ts'
import type { CommandBus } from '@infrastructure/CommandBus/CommandBus.ts'
import type { ContractSignedPayload } from '@infrastructure/EventBus/examples/ContractSigned.ts'
import type { IntegrationEvent } from '@infrastructure/EventBus/IntegrationEvent.ts'
import { ActivateUser } from '@domain/examples/ActivateUser.ts'
import { isIntegrationEvent } from '@infrastructure/EventBus/utils/isIntegrationEvent.ts'

export class ContractSignedHandler implements EventHandler<IntegrationEvent<ContractSignedPayload>> {
  constructor(
    private readonly commandBus: CommandBus,
  ) { }

  private isContractSignedEvent(anEvent: unknown): anEvent is IntegrationEvent<ContractSignedPayload> {
    return isIntegrationEvent(anEvent) && anEvent.type === 'ContractSigned'
  }

  async handle(anEvent: unknown): Promise<void> {
    if (this.isContractSignedEvent(anEvent)) {
      const command = ActivateUser(anEvent.payload.userId, {})
      await this.commandBus.execute(command)
    }
  }
}
