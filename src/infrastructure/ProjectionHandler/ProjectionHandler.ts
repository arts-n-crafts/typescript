import type { Database } from '../Database/Database'
import type { BaseEvent } from '../EventBus/Event'
import type { EventBus } from '../EventBus/EventBus'
import type { EventHandler } from '../EventBus/EventHandler'

export abstract class ProjectionHandler implements EventHandler<BaseEvent> {
  constructor(
    protected eventBus: EventBus,
    protected database: Database,
  ) { }

  abstract start(): void

  abstract update(event: BaseEvent): Promise<void>

  async handle(event: BaseEvent): Promise<void> {
    await this.update(event)
  }
}
