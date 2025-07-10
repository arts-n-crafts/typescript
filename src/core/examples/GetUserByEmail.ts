import type { Query, QueryMetadata } from '@core/Query.ts'
import { createQuery } from '@core/utils/createQuery.ts'

export interface GetUserByEmailProps {
  email: string
}

export function GetUserByEmail(payload: GetUserByEmailProps, metadata?: Partial<QueryMetadata>): Query<GetUserByEmailProps> {
  return createQuery('GetUserByEmail', payload, metadata)
}
