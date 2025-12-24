import type { CreateUserProps, RegisterUserCommand } from '@core/examples/CreateUser.ts'
import type { Rejection, RejectionMetadata } from '@domain/Rejection.ts'
import { createRejection } from '@domain/utils/createRejection.ts'

export function createUserAlreadyExistsRejection(command: RegisterUserCommand, metadata?: Partial<RejectionMetadata>): Rejection<CreateUserProps> {
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
