import type { StreamKey } from '@utils/streamKey/index.ts'

interface Loadable<TReturnType> {
  load(streamKey: StreamKey): Promise<TReturnType>
}

interface Appendable<TEvent, TAppendReturnType = void> {
  append(streamKey: StreamKey, events: TEvent[]): Promise<TAppendReturnType>
}

export interface EventStore<TEvent, TAppendReturnType>
  extends
  Loadable<TEvent[]>,
  Appendable<TEvent, TAppendReturnType> { }
