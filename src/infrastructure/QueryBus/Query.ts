export abstract class Query<TPayload = unknown> {
  constructor(
    public readonly payload: TPayload,
  ) {}
}
