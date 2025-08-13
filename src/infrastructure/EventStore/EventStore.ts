interface Loadable<TReturnType> {
  load(streamName: string, aggregateId: string): Promise<TReturnType>
}

interface Appendable<TEvent, TReturnType = void> {
  append(streamName: string, events: TEvent[]): Promise<TReturnType>
}

export interface EventStore<TEvent, TAppendReturnType = void, TLoadReturnType = TEvent[]>
  extends
  Loadable<TLoadReturnType>,
  Appendable<TEvent, TAppendReturnType> { }
