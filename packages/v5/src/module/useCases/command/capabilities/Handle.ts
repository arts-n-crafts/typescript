import type { Handles } from '../../Handle.ts'

export type HandlesCommand<TCommand, TResult = Promise<void>> = Handles<TCommand, TResult>
