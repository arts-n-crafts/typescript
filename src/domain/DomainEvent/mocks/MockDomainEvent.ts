import { DomainEvent, type DomainEventMetadata } from "../DomainEvent";

export interface MockDomainEventProps {
  name: string;
}

export interface MockDomainEventMetadata extends DomainEventMetadata {
  causationId: string
  timestamp: Date
}

export class MockDomainEvent extends DomainEvent<
  MockDomainEventProps,
  MockDomainEventMetadata
> { }
