export interface Repository<TEvent> {
  load: (aggregateId: string) => Promise<TEvent[]>
  store: (events: TEvent[]) => Promise<void>
}
