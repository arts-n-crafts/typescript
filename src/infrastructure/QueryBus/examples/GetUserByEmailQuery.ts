import { Query } from '../Query'

export interface GetUserByEmailQueryProps {
  email: string
}

export class GetUserByEmailQuery extends Query<GetUserByEmailQueryProps> { }
