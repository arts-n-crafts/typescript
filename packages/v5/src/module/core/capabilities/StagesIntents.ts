export interface StagesIntents<TIntent> {
  stage(intents: TIntent[]): Promise<void>
}
