import type { Maybe } from "../../core/types/Maybe";

export interface QueryMetadata {
  userId?: string;          // ID of the user making the query
  correlationId?: string;   // For distributed tracing
  timestamp?: Date;         // Time the query was issued
  ipAddress?: string;       // IP address of the requester
  userAgent?: string;       // User agent of the requester
  locale?: string;          // Locale of the requester
  tenantId?: string;        // ID of the tenant in a multi-tenant environment
  traceId?: string;         // ID for request tracing/debugging
}

export interface IQuery {
  readonly payload: object,
  readonly metadata: Maybe<QueryMetadata>
}

export abstract class Query<
  TPayload extends IQuery['payload'],
  TMetadata extends IQuery['metadata']
> implements IQuery {
  constructor(
    public readonly payload: TPayload,
    public readonly metadata: TMetadata
  ) {}
}
