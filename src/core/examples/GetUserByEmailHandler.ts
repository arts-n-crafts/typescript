import type { GetUserByEmail } from '@core/examples/GetUserByEmail.ts'
import type { QueryHandler } from '@core/QueryHandler.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { SimpleDatabaseResult } from '@infrastructure/Database/implementations/SimpleDatabase.ts'
import type { UserModel } from './UserProjection.ts'
import { FieldEquals } from '@domain/Specification/implementations/FieldEquals.specification.ts'

export interface GetUserByEmailResult {
  id: string
  email: string
}

export class GetUserByEmailHandler implements QueryHandler<GetUserByEmail, GetUserByEmailResult[]> {
  constructor(
    private readonly database: Database<UserModel, SimpleDatabaseResult>,
  ) {}

  async execute(aQuery: GetUserByEmail): Promise<GetUserByEmailResult[]> {
    const specification = new FieldEquals('email', aQuery.payload.email)
    return this.database.query('users', specification)
  }
}
