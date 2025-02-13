export abstract class Query<TPayload> {
  constructor(
    public readonly payload: TPayload,
  ) {}
}
