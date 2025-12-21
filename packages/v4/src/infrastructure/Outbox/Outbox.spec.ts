import type { DomainEvent } from '@domain/DomainEvent.ts'
import type { Outbox } from './Outbox.ts'
import { getTimestamp } from '@core/utils/getTimestamp.ts'
import { InMemoryOutbox } from './implementations/InMemoryOutbox.ts'

describe('inMemoryOutbox', () => {
  let outbox: Outbox
  let sampleEvent: DomainEvent<{ foo: string }>

  beforeEach(() => {
    outbox = new InMemoryOutbox()
    sampleEvent = {
      id: 'evt-1',
      type: 'TestEvent',
      aggregateId: 'agg-1',
      aggregateType: 'TestAggregate',
      payload: { foo: 'bar' },
      timestamp: getTimestamp(),
      metadata: {},
      kind: 'domain',
    }
  })

  it('enqueue adds event to outbox', async () => {
    await outbox.enqueue(sampleEvent)
    const pending = await outbox.getPending()
    expect(pending).toHaveLength(1)
    expect(pending[0].event).toEqual(sampleEvent)
    expect(pending[0].published).toBe(false)
    expect(pending[0].retryCount).toBe(0)
  })

  it('getPending returns only unpublished entries', async () => {
    await outbox.enqueue(sampleEvent)
    const entries = await outbox.getPending()
    expect(entries.every(e => !e.published)).toBe(true)

    await outbox.markAsPublished(entries[0].id)
    const pendingAfter = await outbox.getPending()
    expect(pendingAfter).toHaveLength(0)
  })

  it('markAsPublished updates published status', async () => {
    await outbox.enqueue(sampleEvent)
    const [entry] = await outbox.getPending()
    await outbox.markAsPublished(entry.id)
    const updated = await outbox.getPending()
    expect(updated).toHaveLength(0)
  })

  it('markAsPublished does not update a unknown entry', async () => {
    await outbox.enqueue(sampleEvent)
    await outbox.markAsPublished('1337')
    const updated = await outbox.getPending()
    expect(updated).toHaveLength(1)
  })

  it('markAsFailed increments retryCount and sets lastAttemptAt', async () => {
    await outbox.enqueue(sampleEvent)
    const [entry] = await outbox.getPending()
    await outbox.markAsFailed(entry.id)

    const updated = await outbox.getPending()
    expect(updated).toHaveLength(1)
    expect(updated[0].retryCount).toBe(1)
    expect(updated[0].lastAttemptAt).toBeDefined()
  })

  it('markAsFailed does not update a unknown entry', async () => {
    await outbox.enqueue(sampleEvent)
    await outbox.markAsFailed('1337')

    const updated = await outbox.getPending()
    expect(updated).toHaveLength(1)
    expect(updated[0].retryCount).toBe(0)
    expect(updated[0].lastAttemptAt).toBeUndefined()
  })

  it('markAsFailed does not update an already failed entry', async () => {
    await outbox.enqueue(sampleEvent)
    const [entry] = await outbox.getPending()
    await outbox.markAsFailed(entry.id)

    const updated = await outbox.getPending()
    expect(updated).toHaveLength(1)
    expect(updated[0].retryCount).toBe(1)
    expect(updated[0].lastAttemptAt).toBeDefined()
  })

  it('getPending limits results', async () => {
    const events = Array.from({ length: 5 }).map((_, i) => ({ ...sampleEvent, id: `evt-${i}` }))
    await Promise.all(events.map(async event => outbox.enqueue(event)))
    const limited = await outbox.getPending(3)
    expect(limited).toHaveLength(3)
  })
})
