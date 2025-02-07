import type { Maybe } from "../../core/types/Maybe";

export interface CommandMetadata {
  traceId?: string;         // ID for request tracing/debugging
  correlationId?: string;   // For distributed tracing
  userId?: string;          // ID of the user initiating the command
  timestamp?: Date;         // Time the command was issued
  ipAddress?: string;       // IP address of the requester
  userAgent?: string;       // User agent of the requester
  locale?: string;          // Locale of the requester
  tenantId?: string;        // ID of the tenant in a multi-tenant environment
  [key: string]: unknown;   // Additional metadata
}

export abstract class Command<TPayload> {
  constructor(
    public readonly payload: TPayload,
    public readonly metadata: Maybe<CommandMetadata>
  ) {}
}
