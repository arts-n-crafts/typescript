import type { IntegrationEvent } from '@infrastructure/EventBus/IntegrationEvent.ts'
import type { DomainEvent } from './DomainEvent.ts'

export type BaseEvent<TPayload> = DomainEvent<TPayload> | IntegrationEvent<TPayload>
