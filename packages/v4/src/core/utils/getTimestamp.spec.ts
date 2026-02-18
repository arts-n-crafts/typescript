import { getTimestamp } from './getTimestamp.ts'

describe('getTimestamp util', () => {
  it('should be defined', () => {
    expect(getTimestamp).toBeDefined()
  })

  it('should create a unix timestamp in seconds', () => {
    const unix = getTimestamp(new Date('2012-12-12T00:00:00Z'))
    expect(unix).toBe(1355270400000)
  })
})
