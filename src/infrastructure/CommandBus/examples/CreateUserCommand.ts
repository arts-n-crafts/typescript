import type { UUID } from 'node:crypto'
import { Command } from '../Command'

export interface CreateUserCommandProps {
  name: string
  email: string
  age?: number
}

export class CreateUserCommand extends Command<CreateUserCommandProps, UUID> { }
