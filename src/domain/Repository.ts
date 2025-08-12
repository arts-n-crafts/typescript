interface Loadable<TReturnType> {
  load(aggregateId: string): Promise<TReturnType>
}

interface Storeable<TEvent, TReturnType = void> {
  store(events: TEvent[]): Promise<TReturnType>
}

export interface Repository<TEvent, TLoadReturnType, TStoreReturnType = void>
  extends
  Loadable<TLoadReturnType>,
  Storeable<TEvent, TStoreReturnType>
{
  readonly streamName: string
}
