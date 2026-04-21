export interface LoadsDomainEvents<TEvent, TResult = Promise<TEvent[]>> {
  load(streamName: string, aggregateId: string): TResult
}
