import type { GetUserByEmailQuery } from './GetUserByEmailQuery'
import { UserByEmailSpecification } from '../../../domain/Specification/examples/UserByEmailSpecification'
import { QueryHandler } from '../QueryHandler'

export interface GetUserByEmailQueryResult {
  id: string
  email: string
}

export class GetUserByEmailQueryHandler extends QueryHandler<GetUserByEmailQuery, GetUserByEmailQueryResult[]> {
  async execute(query: GetUserByEmailQuery): Promise<GetUserByEmailQueryResult[]> {
    const specification = new UserByEmailSpecification(query.payload.email)
    return this.database.query<GetUserByEmailQueryResult>('users', specification)
  }
}
