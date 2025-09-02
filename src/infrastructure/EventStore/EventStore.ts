interface Loadable<TReturnType = Promise<unknown>> {
  load(streamName: string, aggregateId: string): TReturnType
}

interface Appendable<TEvent, TReturnType = Promise<void>> {
  append(streamName: string, events: TEvent[]): TReturnType
}

export interface EventStore<TEvent, TAppendReturnType = void, TLoadReturnType = TEvent[]>
  extends
  Loadable<TLoadReturnType>,
  Appendable<TEvent, TAppendReturnType> { }
