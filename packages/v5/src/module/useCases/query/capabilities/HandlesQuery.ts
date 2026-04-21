export interface HandlesQuery<TQuery, TData = Promise<object>> {
  handle(input: TQuery): TData
}
