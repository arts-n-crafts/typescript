import { randomUUID } from 'node:crypto'
import { makeStreamId } from '@utils/streamId/makeStreamId.js'

describe('makeStreamId', () => {
  it('should be defined', () => {
    expect(makeStreamId).toBeDefined()
  })

  it('should format the right streamId', () => {
    const stream = 'user'
    const id = randomUUID()
    const streamId = makeStreamId(stream, id)
    expect(streamId).toBe(`${stream}-${id}`)
  })
})
