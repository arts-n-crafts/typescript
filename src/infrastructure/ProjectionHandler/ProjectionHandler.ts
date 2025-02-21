import type { DomainEvent } from '../../domain/DomainEvent/DomainEvent'
import type { Database } from '../Database/Database'

export abstract class ProjectionHandler {
  constructor(
    private readonly database: Database,
  ) {}

  abstract update(event: DomainEvent<unknown>): Promise<void>
}
