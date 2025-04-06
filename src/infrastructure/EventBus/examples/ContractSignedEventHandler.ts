import type { CommandBus } from '../../CommandBus/CommandBus'
import type { ContractSigned } from './ContractSigned'
import { UserContractSignedCommand } from '../../CommandBus/examples/UserContractSignedCommand'
import { EventHandler } from '../EventHandler'

type ContractSignedEvent = ReturnType<typeof ContractSigned>

export class ContractSignedEventHandler
  extends EventHandler<ContractSignedEvent> {
  constructor(
    private readonly commandBus: CommandBus,
  ) {
    super()
  }

  async handle(event: ContractSignedEvent): Promise<void> {
    if (event.type === 'ContractSigned') {
      const command = new UserContractSignedCommand(event.payload.userId, {})
      // this.commandBus()
    }
  }
}
