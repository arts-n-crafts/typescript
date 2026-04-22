import type { DomainEvent } from "src/module/core/shapes/DomainEvent.ts";
import type { Intent } from "src/module/core/shapes/Intent.ts";

export interface Decision<TEvent extends DomainEvent, TIntent extends Intent = never> {
  readonly events: TEvent[];
  readonly intents: TIntent[];
}
