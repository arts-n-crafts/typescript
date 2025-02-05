import type { Maybe } from "../../core/types/Maybe";

export interface CommandMetadata {
  userId?: string;          // ID of the user initiating the command
  correlationId?: string;   // For distributed tracing
  timestamp?: Date;         // Time the command was issued
  ipAddress?: string;       // IP address of the requester
  userAgent?: string;       // User agent of the requester
  locale?: string;          // Locale of the requester
  tenantId?: string;        // ID of the tenant in a multi-tenant environment
  traceId?: string;         // ID for request tracing/debugging
  [key: string]: unknown;   // Additional metadata
}

export interface ICommand {
  readonly payload: object
  readonly metadata: Maybe<CommandMetadata>
}

export abstract class Command<
  TPayload extends ICommand['payload'],
  TMetadata extends ICommand['metadata']
> implements ICommand {
  constructor(
    public readonly payload: TPayload,
    public readonly metadata: TMetadata
  ) {}
}
