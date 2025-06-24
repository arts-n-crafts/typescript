import type { BaseEvent } from '../../domain/BaseEvent'
import type { CommandBus, IntegrationEvent } from '../../infrastructure'
import type { ContractSignedPayload } from '../../infrastructure/EventBus/examples/ContractSigned'
import type { EventHandler } from '../EventHandler'
import { ActivateUser } from '../../domain/examples/ActivateUser'
import { isIntegrationEvent } from '../../infrastructure'

export class ContractSignedHandler implements EventHandler {
  constructor(
    private readonly commandBus: CommandBus,
  ) { }

  private isContractSignedEvent(anEvent: BaseEvent): anEvent is IntegrationEvent<ContractSignedPayload> {
    return isIntegrationEvent(anEvent) && anEvent.type === 'ContractSigned'
  }

  async handle(anEvent: BaseEvent): Promise<void> {
    if (this.isContractSignedEvent(anEvent)) {
      const command = ActivateUser(anEvent.payload.userId, {})
      await this.commandBus.execute(command)
    }
  }
}
