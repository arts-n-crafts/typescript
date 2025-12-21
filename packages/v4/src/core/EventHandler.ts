import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { ExternalEvent } from '@infrastructure/EventBus/ExternalEvent.ts'
import type { IntegrationEvent } from '@infrastructure/EventBus/IntegrationEvent.ts'

interface Handling<TEvent extends DomainEvent | IntegrationEvent | ExternalEvent, TReturnType> {
  handle(anEvent: TEvent): TReturnType
}

export interface EventHandler<TEvent extends DomainEvent | IntegrationEvent | ExternalEvent, TReturnType = Promise<void>>
  extends Handling<TEvent, TReturnType>
{}
