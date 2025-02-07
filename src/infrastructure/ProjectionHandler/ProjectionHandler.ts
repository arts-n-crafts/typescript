import { DomainEvent } from "../../domain/DomainEvent/DomainEvent";

export interface ProjectionHandler {
  start(): void;
  updateProjection(event: DomainEvent<unknown>): Promise<void>;
}
