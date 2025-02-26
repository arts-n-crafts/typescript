import { Command } from '../Command'

export interface CreateUserCommandProps {
  name: string
  email: string
  age?: number
}

export class CreateUserCommand extends Command<CreateUserCommandProps> { }
