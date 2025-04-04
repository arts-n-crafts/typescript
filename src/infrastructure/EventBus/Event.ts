import type { DomainEvent } from '../../domain/DomainEvent/DomainEvent'
import type { IntegrationEvent } from '../EventBus/IntegrationEvent'

export type Event = DomainEvent | IntegrationEvent
