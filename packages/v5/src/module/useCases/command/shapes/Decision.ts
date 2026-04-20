export interface Decision<TEvent, TIntent = never> {
  readonly events: TEvent[]
  readonly intents: TIntent[]
}
