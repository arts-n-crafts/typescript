import { DomainEvent } from "../../domain/DomainEvent/DomainEvent";
import type { Database } from "../Database/Database";

export abstract class ProjectionHandler {
  constructor(
    private readonly database: Database
  ) {}

  abstract start(): void
  abstract updateProjection(event: DomainEvent<unknown>): Promise<void>
}
