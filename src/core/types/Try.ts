export type Try<T, E extends Error = Error> = [T, undefined] | [undefined, E]
