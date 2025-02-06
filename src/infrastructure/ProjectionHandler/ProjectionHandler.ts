import { type IDomainEvent } from "../../domain/DomainEvent/DomainEvent";

export interface ProjectionHandler {
  start(): void;
  updateProjection(event: IDomainEvent): Promise<void>;
}
