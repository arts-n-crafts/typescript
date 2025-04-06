import type { UUID } from 'node:crypto'
import { Command } from '../Command'

export interface UserContractSignedCommandProps { }

export class UserContractSignedCommand extends Command<UserContractSignedCommandProps, UUID> { }
