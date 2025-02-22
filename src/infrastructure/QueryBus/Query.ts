export abstract class Query<TPayload = unknown> {
  constructor(
    public readonly payload: TPayload,
  ) {}

  get type(): string {
    return 'query'
  }
}
