import type { Query, QueryMetadata } from '../Query'
import { createQuery } from '../utils/createQuery'

export interface GetUserByEmailProps {
  email: string
}

export function GetUserByEmail(payload: GetUserByEmailProps, metadata?: Partial<QueryMetadata>): Query<GetUserByEmailProps> {
  return createQuery('GetUserByEmail', payload, metadata)
}
