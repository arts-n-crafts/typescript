import type { DomainEvent } from "../../domain/DomainEvent/DomainEvent";
import type { Command } from "../CommandBus/Command";
import type { Query } from "../QueryBus/Query";

interface _CommandScenarioTest {
  given: (events: DomainEvent[]) => void;
  when: (command: Command) => void;
  then: (events: DomainEvent[]) => void;
}

interface _QueryScenarioTest {
  given: (events: DomainEvent[]) => void;
  when: (query: Query) => void;
  then: (result: object) => void;
}
