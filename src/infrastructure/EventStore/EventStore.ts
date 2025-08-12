import type { StreamKey } from '@utils/streamKey/index.ts'

interface Loadable<TReturnType> {
  load(streamKey: StreamKey): Promise<TReturnType>
}

interface Appendable<TEvent, TReturnType = void> {
  append(streamKey: StreamKey, events: TEvent[]): Promise<TReturnType>
}

export interface EventStore<TEvent, TAppendReturnType = void, TLoadReturnType = TEvent[]>
  extends
  Loadable<TLoadReturnType>,
  Appendable<TEvent, TAppendReturnType> { }
