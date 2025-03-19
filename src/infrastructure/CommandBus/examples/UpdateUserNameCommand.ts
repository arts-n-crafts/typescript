import type { UUID } from 'node:crypto'
import { Command } from '../Command'

export interface UpdateUserNameCommandProps {
  name: string
}

export class UpdateUserNameCommand extends Command<UpdateUserNameCommandProps, UUID> { }
