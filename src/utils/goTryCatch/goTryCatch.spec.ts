/* eslint-disable no-throw-literal */

import { goTryCatch } from './goTryCatch.ts'

describe('goTryCatch', () => {
  it('returns [result, undefined] on success', async () => {
    const fn = async () => 'ok'
    const [result, error] = await goTryCatch(fn)
    expect(result).toBe('ok')
    expect(error).toBeUndefined()
  })

  it('returns [undefined, Error] on exception', async () => {
    const fn = async () => {
      throw new Error('fail')
    }
    const [result, error] = await goTryCatch(fn)
    expect(result).toBeUndefined()
    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('fail')
  })

  it('wraps string throws into Error', async () => {
    const fn = async () => {
      throw 'boom'
    }
    const [_, error] = await goTryCatch(fn)
    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('boom')
  })

  it('handles thrown numbers', async () => {
    const fn = async () => {
      throw 123
    }
    const [_, error] = await goTryCatch(fn)
    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('123')
  })

  it('handles thrown null', async () => {
    const fn = async () => {
      throw null
    }
    const [_, error] = await goTryCatch(fn)
    expect(error).toBeInstanceOf(Error)
    expect(error?.message).toBe('null')
  })
})
