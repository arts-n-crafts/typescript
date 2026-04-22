export interface HandlesCommand<TCommand, TResult = Promise<void>> {
  handle(input: TCommand): TResult;
}
