import { Query } from '../Query'

export interface MockGetUserByEmailQueryProps {
  email: string
}

export class MockGetUserByEmailQuery extends Query<MockGetUserByEmailQueryProps> { }
