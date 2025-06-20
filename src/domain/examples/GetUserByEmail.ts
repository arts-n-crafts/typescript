import type { QueryMetadata } from '../Query.ts'
import { createQuery } from '../utils/createQuery.ts'

export interface GetUserByEmailProps {
  email: string
}

export function GetUserByEmail(payload: GetUserByEmailProps, metadata?: Partial<QueryMetadata>) {
  return createQuery('GetUserByEmail', payload, metadata)
}
