export interface EventStore<TEvent> {
  store: (event: TEvent) => Promise<void>
  loadEvents: (aggregateId: string) => Promise<TEvent[]>
}
