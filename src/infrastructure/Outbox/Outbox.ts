import type { OutboxEntry } from '@infrastructure/Outbox/OutboxEntry.ts'

interface Enqueueable<TReturnType = void> {
  enqueue(event: OutboxEntry['event']): Promise<TReturnType>
}

export interface Outbox<
  TEnqueueReturnType = void,
  TGetPendingReturnType = OutboxEntry[],
  TMarkAsPublishedReturnType = void,
  TMarkAsFailedReturnType = void,
>
  extends Enqueueable<TEnqueueReturnType>
{
  getPending(limit?: number): Promise<TGetPendingReturnType>
  markAsPublished(id: string): Promise<TMarkAsPublishedReturnType>
  markAsFailed(id: string): Promise<TMarkAsFailedReturnType>
}
