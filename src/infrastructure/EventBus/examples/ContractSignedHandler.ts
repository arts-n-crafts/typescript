import type { CommandBus } from '../../CommandBus/CommandBus'
import type { IntegrationEvent } from '../IntegrationEvent'
import type { ContractSignedPayload } from './ContractSigned'
import { ActivateUser } from '../../CommandBus/examples/ActivateUser'
import { EventHandler } from '../EventHandler'

type EventType = IntegrationEvent<ContractSignedPayload>

export class ContractSignedHandler extends EventHandler<EventType> {
  constructor(
    private readonly commandBus: CommandBus,
  ) {
    super()
  }

  async handle(event: EventType): Promise<void> {
    if (event.type === 'ContractSigned') {
      const command = ActivateUser(event.payload.userId, {})
      await this.commandBus.execute(command)
    }
  }
}
