import type { Query } from '../Query'
import type { GetUserByEmailProps } from './GetUserByEmail'
import { UserByEmailSpecification } from '../../../domain/Specification/examples/UserByEmailSpecification'
import { QueryHandler } from '../QueryHandler'

type QueryType = Query<GetUserByEmailProps>

export interface GetUserByEmailResult {
  id: string
  email: string
}

export class GetUserByEmailHandler extends QueryHandler<QueryType, GetUserByEmailResult[]> {
  async execute(query: QueryType): Promise<GetUserByEmailResult[]> {
    const specification = new UserByEmailSpecification(query.payload.email)
    return this.database.query<GetUserByEmailResult>('users', specification)
  }
}
