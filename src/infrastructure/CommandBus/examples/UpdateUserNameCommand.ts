import { Command } from '../Command'

export interface UpdateUserNameCommandProps {
  aggregateId: string
  name: string
}

export class UpdateUserNameCommand extends Command<UpdateUserNameCommandProps> { }
