import type { EventHandler } from '@core/EventHandler.ts'
import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { UserCommand } from '@domain/examples/User.ts'
import type { CommandBus } from '@infrastructure/CommandBus/CommandBus.ts'
import type { ContractSignedEvent } from '@infrastructure/EventBus/examples/ContractSigned.ts'
import type { ExternalEvent } from '@infrastructure/EventBus/ExternalEvent.ts'
import type { IntegrationEvent } from '@infrastructure/EventBus/IntegrationEvent.ts'
import { createActivateUserCommand } from '@core/examples/ActivateUser.ts'

export class ContractSignedHandler implements EventHandler<ContractSignedEvent, Promise<void>> {
  constructor(
    private readonly commandBus: CommandBus<UserCommand, Promise<void>>,
  ) {
  }

  isContractSignedEvent(anEvent: DomainEvent | IntegrationEvent | ExternalEvent): anEvent is ContractSignedEvent {
    return anEvent.type === 'ContractSigned'
  }

  async handle(anEvent: DomainEvent | IntegrationEvent | ExternalEvent): Promise<void> {
    if (this.isContractSignedEvent(anEvent)) {
      const command = createActivateUserCommand(anEvent.payload.userId, {})
      await this.commandBus.execute(command)
    }
  }
}
