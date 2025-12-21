interface Executable<TInput, TResult> {
  execute(input: TInput): TResult
}

export interface Directive<TInput, TResult = void>
  extends Executable<TInput, TResult> {
}
