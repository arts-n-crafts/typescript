import type { IntegrationEvent } from '@infrastructure/EventBus/IntegrationEvent.ts'
import type { DomainEvent } from './DomainEvent.ts'

export type BaseEvent<TPayload = unknown> = DomainEvent<TPayload> | IntegrationEvent<TPayload>
