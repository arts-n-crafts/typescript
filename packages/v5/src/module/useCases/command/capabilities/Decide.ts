import type { DomainEvent } from "@core/shapes/DomainEvent.ts";
import type { Intent } from "@core/shapes/Intent.ts";
import type { Decision } from "../shapes/Decision.ts";

export interface Decide<
  TCommand,
  TState,
  TEvent extends DomainEvent,
  TIntent extends Intent = never,
> {
  decide(command: TCommand, currentState: TState): Decision<TEvent, TIntent>;
}
