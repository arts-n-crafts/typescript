import type { Try } from '@core/types/Try.ts'
import { parseAsError } from '@utils/parseAsError/parseAsError.ts'

export async function goTryCatch<T>(promise: Promise<T>): Promise<Try<T, Error>>
export async function goTryCatch<T>(fn: () => Promise<T>): Promise<Try<T, Error>>
export async function goTryCatch<T>(input: Promise<T> | (() => Promise<T>)): Promise<Try<T, Error>> {
  try {
    const result = await (typeof input === 'function' ? input() : input)
    return [result, undefined]
  }
  catch (err) {
    return [undefined, parseAsError(err)]
  }
}
