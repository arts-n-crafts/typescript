import type { QueryMetadata } from '../Query'
import { createQuery } from '../utils/createQuery'

export interface GetUserByEmailProps {
  email: string
}

export function GetUserByEmail(payload: GetUserByEmailProps, metadata?: Partial<QueryMetadata>) {
  return createQuery('GetUserByEmail', payload, metadata, 1)
}
