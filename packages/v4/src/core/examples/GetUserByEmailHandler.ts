import type { GetUserByEmail } from '@core/examples/GetUserByEmail.ts'
import type { QueryHandler } from '@core/QueryHandler.ts'
import type { WithIdentifier } from '@core/types/WithIdentifier.ts'
import type { UserCreatedPayload } from '@domain/examples/UserCreated.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import { FieldEquals } from '@domain/Specification/implementations/FieldEquals.specification.ts'

export interface GetUserByEmailResult {
  id: string
  email: string
}

export class GetUserByEmailHandler implements QueryHandler<GetUserByEmail, Promise<GetUserByEmailResult[]>> {
  constructor(
    private readonly database: Database<WithIdentifier<UserCreatedPayload>, Promise<void>, Promise<WithIdentifier<UserCreatedPayload>[]>>,
  ) {}

  async execute(aQuery: GetUserByEmail): Promise<GetUserByEmailResult[]> {
    const specification = new FieldEquals('email', aQuery.payload.email)
    return this.database.query('users', specification)
  }
}
