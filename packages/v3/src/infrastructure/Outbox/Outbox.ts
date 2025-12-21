import type { OutboxEntry } from '@infrastructure/Outbox/OutboxEntry.ts'

interface Queueable<TReturnType = Promise<void>> {
  enqueue(event: OutboxEntry['event']): TReturnType
}

export interface Outbox<
  TEnqueueReturnType = Promise<void>,
  TGetPendingReturnType = Promise<OutboxEntry[]>,
  TMarkAsPublishedReturnType = Promise<void>,
  TMarkAsFailedReturnType = Promise<void>,
>
  extends Queueable<TEnqueueReturnType>
{
  getPending(limit?: number): TGetPendingReturnType
  markAsPublished(id: string): TMarkAsPublishedReturnType
  markAsFailed(id: string): TMarkAsFailedReturnType
}
