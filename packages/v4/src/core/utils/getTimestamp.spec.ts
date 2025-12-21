import { getTimestamp } from './getTimestamp.ts'

describe('getTimestamp util', () => {
  it('should be defined', () => {
    expect(getTimestamp).toBeDefined()
  })

  it('should create a unix timestamp in seconds', () => {
    const unix = getTimestamp(new Date('12-12-2012'))
    expect(unix).toBe(1355266800)
  })
})
