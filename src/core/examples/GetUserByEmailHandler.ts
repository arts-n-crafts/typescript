import type { GetUserByEmail } from '@core/examples/GetUserByEmail.ts'
import type { QueryHandler } from '@core/QueryHandler.ts'
import type { InMemoryDatabase } from '@infrastructure/Database/implementations/InMemoryDatabase.js'
import { FieldEquals } from '@domain/Specification/implementations/FieldEquals.specification.ts'

export interface GetUserByEmailResult {
  id: string
  email: string
}

export class GetUserByEmailHandler implements QueryHandler<GetUserByEmailResult[]> {
  constructor(
    private readonly database: InMemoryDatabase,
  ) {}

  async execute(aQuery: GetUserByEmail): Promise<GetUserByEmailResult[]> {
    const specification = new FieldEquals('email', aQuery.payload.email)
    return this.database.query<GetUserByEmailResult>('users', specification)
  }
}
