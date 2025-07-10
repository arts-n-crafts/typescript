import type { GetUserByEmailProps } from '@core/examples/GetUserByEmail.ts'
import type { Query } from '@core/Query.ts'
import type { QueryHandler } from '@core/QueryHandler.ts'
import type { Database } from '@infrastructure/Database/Database.ts'

export interface GetUserByEmailResult {
  id: string
  email: string
}

export class GetUserByEmailHandler implements QueryHandler<GetUserByEmailProps, GetUserByEmailResult[]> {
  constructor(
    private readonly database: Database,
  ) {}

  async execute(aQuery: Query<GetUserByEmailProps>): Promise<GetUserByEmailResult[]> {
    return this.database.query<GetUserByEmailResult>('users', [{ email: aQuery.payload.email }])
  }
}
