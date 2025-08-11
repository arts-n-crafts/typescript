interface Runnable<TReturnType = void> {
  runOnce(): Promise<TReturnType>
}

interface Tickable<TReturnType = void> {
  tick(): Promise<TReturnType>
}

interface Startable<TReturnType = void> {
  start(intervalMs: number): TReturnType
}

export interface OutboxWorker
  extends Runnable, Tickable, Startable
{ }
