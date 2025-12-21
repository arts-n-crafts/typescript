interface Runnable<TReturnType = Promise<void>> {
  runOnce(): TReturnType
}

interface Tickable<TReturnType = Promise<void>> {
  tick(): TReturnType
}

interface Startable<TReturnType = void> {
  start(intervalMs: number): TReturnType
}

export interface OutboxWorker
  extends Runnable, Tickable, Startable
{ }
