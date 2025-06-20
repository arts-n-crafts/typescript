import type { Query } from '../../domain'
import type { GetUserByEmailProps } from '../../domain/examples/GetUserByEmail.ts'
import type { Database } from '../../infrastructure'
import type { QueryHandler } from '../QueryHandler.ts'

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
