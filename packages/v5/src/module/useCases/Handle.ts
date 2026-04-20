export interface Handles<TInput, TResult = Promise<void>> {
  handle(input: TInput): TResult
}
