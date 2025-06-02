import type { Database } from '../../Database/Database'
import type { IQueryHandler } from '../IQueryHandler'
import type { Query } from '../Query'
import type { GetUserByEmailProps } from './GetUserByEmail'
import { UserByEmailSpecification } from '../../../domain/Specification/examples/UserByEmailSpecification'

export interface GetUserByEmailResult {
  id: string
  email: string
}

export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailProps, GetUserByEmailResult[]> {
  constructor(
    private readonly database: Database,
  ) {}

  async execute(aQuery: Query<GetUserByEmailProps>): Promise<GetUserByEmailResult[]> {
    const specification = new UserByEmailSpecification(aQuery.payload.email)
    return this.database.query<GetUserByEmailResult>('users', specification)
  }
}
