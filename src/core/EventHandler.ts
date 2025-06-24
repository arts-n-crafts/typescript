export interface EventHandler<TEvent> {
  handle: (anEvent: TEvent) => Promise<void>
}
