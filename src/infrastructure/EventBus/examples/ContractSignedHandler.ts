import type { ICommandBus } from '../../CommandBus/ICommandBus'
import type { BaseEvent } from '../BaseEvent'
import type { IEventHandler } from '../IEventHandler'
import type { IntegrationEvent } from '../IntegrationEvent'
import type { ContractSignedPayload } from './ContractSigned'
import { ActivateUser } from '../../CommandBus/examples/ActivateUser'
import { isIntegrationEvent } from '../utils/isIntegrationEvent'

export class ContractSignedHandler implements IEventHandler {
  constructor(
    private readonly commandBus: ICommandBus,
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
