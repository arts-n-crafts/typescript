import type { GetUserByEmail, GetUserByEmailProps } from '@core/examples/GetUserByEmail.ts'
import type { QueryHandler } from '@core/QueryHandler.ts'
import type { Database } from '@infrastructure/Database/Database.ts'
import { FieldEquals } from '@domain/Specification/implementations/FieldEquals.specification.ts'

export interface GetUserByEmailResult {
  id: string
  email: string
}

export class GetUserByEmailHandler implements QueryHandler<'GetUserByEmail', GetUserByEmailProps> {
  constructor(
    private readonly database: Database,
  ) {}

  async execute<TReturnType = GetUserByEmailResult>(aQuery: GetUserByEmail): Promise<TReturnType[]> {
    const specification = new FieldEquals<GetUserByEmailResult>('email', aQuery.payload.email)
    const data = await this.database.query<GetUserByEmailResult>('users', specification)
    return data as TReturnType[]
  }
}
