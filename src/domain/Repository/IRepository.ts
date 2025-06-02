import type { IAggregateRoot } from '../AggregateRoot/IAggregateRoot'

export interface IRepository<TAggregateRoot extends IAggregateRoot> {
  load: (aggregateId: string) => Promise<TAggregateRoot>
  store: (aggregate: TAggregateRoot) => Promise<void>
}
