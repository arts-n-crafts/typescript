import type { UserEvent } from '@domain/examples/User.ts'
import type { EventBus } from '@infrastructure/EventBus/EventBus.ts'
import type { Outbox } from './Outbox.ts'
import { createDomainEvent } from '@domain/utils/createDomainEvent.ts'
import { SimpleEventBus } from '@infrastructure/EventBus/implementations/SimpleEventBus.ts'
import { GenericOutboxWorker } from './implementations/GenericOutboxWorker.ts'
import { InMemoryOutbox } from './implementations/InMemoryOutbox.ts'

describe('outboxWorker with InMemoryEventBus', () => {
  let outbox: Outbox
  let eventBus: EventBus<UserEvent>
  let worker: GenericOutboxWorker
  const handler = {
    handle: vi.fn().mockResolvedValue(undefined),
    start: vi.fn().mockResolvedValue(undefined),
  }

  beforeEach(() => {
    outbox = new InMemoryOutbox()
    eventBus = new SimpleEventBus()
    worker = new GenericOutboxWorker(outbox, eventBus)
    handler.handle.mockClear()
  })

  it('publishes outbox events and calls subscribed handlers', async () => {
    eventBus.subscribe('MyEvent', handler)

    const event = createDomainEvent('MyEvent', 'agg-1', { foo: 'bar' })
    await outbox.enqueue(event)

    await worker.tick()

    expect(handler.handle).toHaveBeenCalledTimes(1)
    expect(handler.handle).toHaveBeenCalledWith(event)

    const pending = await outbox.getPending()
    expect(pending).toHaveLength(0)
  })

  it('marks failed events and increments retry count', async () => {
    eventBus.subscribe('FailEvent', {
      handle: vi.fn().mockRejectedValue(new Error('fail')),
      start: vi.fn().mockResolvedValue(undefined),
    })

    const event = createDomainEvent('FailEvent', 'agg-2', {})
    await outbox.enqueue(event)

    await worker.tick()

    const [entry] = await outbox.getPending()
    expect(entry.retryCount).toBe(1)
    expect(entry.published).toBe(false)
  })

  it('start() runs tick periodically', async () => {
    vi.useFakeTimers()
    eventBus.subscribe('IntervalEvent', handler)

    const event = createDomainEvent('IntervalEvent', 'agg-3', {})
    await outbox.enqueue(event)

    worker.start(1000)

    vi.advanceTimersByTime(1000)
    vi.runAllTicks()
    await Promise.resolve()

    expect(handler.handle).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})
