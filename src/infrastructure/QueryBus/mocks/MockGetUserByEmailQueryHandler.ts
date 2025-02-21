import type { MockGetUserByEmailQuery } from './MockGetUserByEmailQuery'
import { MockUserByEmailSpecification } from '../../../domain/Specification/mocks/MockUserByEmailSpecification'
import { QueryHandler } from '../QueryHandler'

export interface MockGetUserByEmailQueryResult {
  id: string
  email: string
}

export class MockGetUserByEmailQueryHandler extends QueryHandler<MockGetUserByEmailQuery, MockGetUserByEmailQueryResult[]> {
  async execute(query: MockGetUserByEmailQuery): Promise<MockGetUserByEmailQueryResult[]> {
    const specification = new MockUserByEmailSpecification(query.payload.email)
    return this.database.query<MockGetUserByEmailQueryResult>('users', specification)
  }
}
