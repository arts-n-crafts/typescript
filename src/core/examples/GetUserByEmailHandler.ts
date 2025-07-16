import type { GetUserByEmailProps } from '@core/examples/GetUserByEmail.ts'
import type { Query } from '@core/Query.ts'
import type { QueryHandler } from '@core/QueryHandler.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import { FieldEquals } from '@domain/Specification/implementations/FieldEquals.specification.ts'

export interface GetUserByEmailResult {
  id: string
  email: string
}

export class GetUserByEmailHandler implements QueryHandler<GetUserByEmailProps, GetUserByEmailResult[]> {
  constructor(
    private readonly database: Database,
  ) {}

  async execute(aQuery: Query<GetUserByEmailProps>): Promise<GetUserByEmailResult[]> {
    const specification = new FieldEquals<GetUserByEmailResult>('email', aQuery.payload.email)
    return this.database.query<GetUserByEmailResult>('users', specification)
  }
}
