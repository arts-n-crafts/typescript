import type { CommandMetadata } from '@core/Command.ts'
import type { CreateUserProps, RegisterUserCommand } from '@core/examples/CreateUser.ts'
import type { Rejection } from '@domain/Rejection.ts'
import { createRejection } from '@domain/utils/createRejection.ts'

export function createUserAlreadyExistsRejection(command: RegisterUserCommand, metadata?: Partial<CommandMetadata>): Rejection<CreateUserProps> {
  return createRejection({
    classification: 'business',
    commandId: command.id,
    commandType: command.type,
    reasonCode: 'ALREADY_EXISTS',
    type: 'Rejected',
    details: command.payload,
  }, metadata)
}

export type UserAlreadyExistsRejection = ReturnType<typeof createUserAlreadyExistsRejection>
