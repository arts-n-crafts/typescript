import type { GetUserByEmail } from '@core/examples/GetUserByEmail.ts'
import type { QueryHandler } from '@core/QueryHandler.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import type { UserModel } from './UserProjection.ts'
import { FieldEquals } from '@domain/Specification/implementations/FieldEquals.specification.ts'

export interface GetUserByEmailResult {
  id: string
  email: string
}

export class GetUserByEmailHandler implements QueryHandler<GetUserByEmail, Promise<GetUserByEmailResult[]>> {
  constructor(
    private readonly database: Database<UserModel, Promise<void>, Promise<UserModel[]>>,
  ) {}

  async execute(aQuery: GetUserByEmail): Promise<GetUserByEmailResult[]> {
    const specification = new FieldEquals('email', aQuery.payload.email)
    return this.database.query('users', specification)
  }
}
