import { Event } from '../../infrastructure/EventBus/Event'

export abstract class DomainEvent<TPayload> extends Event<TPayload> {
  private readonly _aggregateId: string

  constructor(
    aggregateId: string,
    payload: TPayload,
  ) {
    super(payload)
    this._aggregateId = aggregateId
  }

  get aggregateId(): string {
    return this._aggregateId
  }

  get type(): string {
    return 'domainEvent'
  }
}
