import { randomUUID } from 'node:crypto'
import { makeStreamKey } from '@utils/streamKey/makeStreamKey.ts'

describe('makeStreamKey', () => {
  it('should be defined', () => {
    expect(makeStreamKey).toBeDefined()
  })

  it('should format the right streamKey', () => {
    const streamName = 'users'
    const aggregateId = randomUUID()
    const streamKey = makeStreamKey(streamName, aggregateId)
    expect(streamKey).toBe(`${streamName}#${aggregateId}`)
  })
})
