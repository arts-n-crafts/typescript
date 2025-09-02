interface Loadable<TReturnType> {
  load(aggregateId: string): TReturnType
}

interface Storable<TEvent, TReturnType = Promise<void>> {
  store(events: TEvent[]): TReturnType
}

export interface Repository<TEvent, TLoadReturnType, TStoreReturnType = void>
  extends
  Loadable<TLoadReturnType>,
  Storable<TEvent, TStoreReturnType>
{
  readonly streamName: string
}
