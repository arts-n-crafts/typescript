export interface OutboxWorker {
  runOnce: () => Promise<void>
  tick: () => Promise<void>
  start: (intervalMs: number) => void
}
