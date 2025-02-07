import type { DomainEvent } from "../../domain/DomainEvent/DomainEvent";
import type { Command } from "../CommandBus/Command";
import type { Query } from "../QueryBus/Query";

interface _CommandScenarioTest {
  given: (events: DomainEvent<unknown>[]) => void;
  when: (command: Command<unknown>) => void;
  then: (events: DomainEvent<unknown>[]) => void;
}

interface _QueryScenarioTest {
  given: (events: DomainEvent<unknown>[]) => void;
  when: (query: Query<unknown>) => void;
  then: (result: unknown) => void;
}
