import type { Database } from '../Database/Database'
import type { Event } from '../EventBus/Event'
import type { EventBus } from '../EventBus/EventBus'
import type { EventHandler } from '../EventBus/EventHandler'

export abstract class ProjectionHandler implements EventHandler<Event> {
  constructor(
    protected eventBus: EventBus,
    protected database: Database,
  ) { }

  abstract start(): void

  abstract update(event: Event): Promise<void>

  async handle(event: Event): Promise<void> {
    await this.update(event)
  }
}
