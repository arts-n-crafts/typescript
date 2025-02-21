import type { DomainEvent } from '../../domain/DomainEvent/DomainEvent'
import type { Database } from '../Database/Database'
import type { EventBus } from '../EventBus/EventBus'
import type { EventHandler } from '../EventBus/EventHandler'

export abstract class ProjectionHandler implements EventHandler<DomainEvent<unknown>> {
  constructor(
    protected eventBus: EventBus,
    protected database: Database,
  ) { }

  abstract start(): void

  abstract update<TPayload>(event: DomainEvent<TPayload>): Promise<void>

  async handle(event: DomainEvent<unknown>): Promise<void> {
    await this.update(event)
  }
}
