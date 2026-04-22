import type { Message } from "./Message.ts";

export interface Intent<TPayload = unknown> extends Message<TPayload> {
  kind: "intent";
}
