interface Loadable<TReturnType> {
  load(aggregateId: string): Promise<TReturnType>
}

interface Storeable<TEvent, TReturnType> {
  store(events: TEvent[]): Promise<TReturnType>
}

export interface Repository<TEvent, TStoreReturnType, TLoadReturnType>
  extends
  Loadable<TLoadReturnType>,
  Storeable<TEvent, TStoreReturnType>
{
  readonly streamName: string
}
