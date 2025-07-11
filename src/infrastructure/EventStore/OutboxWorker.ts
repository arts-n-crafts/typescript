export interface OutboxWorker {
  tick: () => Promise<void>
}
