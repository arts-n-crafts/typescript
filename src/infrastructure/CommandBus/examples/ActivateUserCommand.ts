import type { UUID } from 'node:crypto'
import { Command } from '../Command'

export interface ActivateUserCommandProps { }

export class ActivateUserCommand extends Command<ActivateUserCommandProps, UUID> { }
