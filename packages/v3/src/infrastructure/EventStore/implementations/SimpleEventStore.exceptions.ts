export class MultipleAggregatesException extends Error {
  constructor() {
    super('EventStore append does not support multiple aggregates to be stored')
  }
}
