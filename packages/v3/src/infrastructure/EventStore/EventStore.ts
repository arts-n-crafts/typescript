import type { StoredEvent } from '@infrastructure/EventStore/StoredEvent.ts'

interface Loadable<TEvent, TReturnType = Promise<StoredEvent<TEvent>>> {
  load(streamName: string, aggregateId: string): TReturnType
}

interface Appendable<TEvent, TReturnType = Promise<void>> {
  append(streamName: string, events: TEvent[]): TReturnType
}

export interface EventStore<TEvent, TAppendReturnType = Promise<void>, TLoadReturnType = Promise<TEvent[]>>
  extends Loadable<TEvent, TLoadReturnType>,
  Appendable<TEvent, TAppendReturnType> {
}
