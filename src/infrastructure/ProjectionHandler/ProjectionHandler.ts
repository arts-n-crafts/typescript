import { DomainEvent } from "../../domain/DomainEvent/DomainEvent";

export interface IProjectionHandler {
  start(): void;
  updateProjection(event: DomainEvent<unknown>): Promise<void>;
}

export abstract class ProjectionHandler { }
