import type { Query, QueryMetadata } from '@domain/Query.ts'
import { createQuery } from '@domain/utils/createQuery.ts'

export interface GetUserByEmailProps {
  email: string
}

export function GetUserByEmail(payload: GetUserByEmailProps, metadata?: Partial<QueryMetadata>): Query<GetUserByEmailProps> {
  return createQuery('GetUserByEmail', payload, metadata)
}
