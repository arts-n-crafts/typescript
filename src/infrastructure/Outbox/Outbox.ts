import type { OutboxEntry } from '@infrastructure/Outbox/OutboxEntry.ts'

interface Queueable<TReturnType = Promise<void>> {
  enqueue(event: OutboxEntry['event']): TReturnType
}

export interface Outbox<
  TEnqueueReturnType = void,
  TGetPendingReturnType = Promise<OutboxEntry[]>,
  TMarkAsPublishedReturnType = Promise<void>,
  TMarkAsFailedReturnType = Promise<void>,
>
  extends Queueable<TEnqueueReturnType>
{
  getPending(limit?: number): Promise<TGetPendingReturnType>
  markAsPublished(id: string): Promise<TMarkAsPublishedReturnType>
  markAsFailed(id: string): Promise<TMarkAsFailedReturnType>
}
