type ScenarioPhase = 'given' | 'when' | 'then'

interface Step {
  type: ScenarioPhase
  description: string
  payload: unknown
}

interface ScenarioContext {
  events: any[]
  commands: any[]
  [key: string]: any
}

export interface ScenarioTestConfig {
  testRunnerAdapter: {
    equals: (actual: unknown, expected: unknown, message?: string) => void
  }
  hooks?: {
    before?: (phase: ScenarioPhase, ctx: ScenarioContext, step: Step) => Promise<void> | void
    after?: (phase: ScenarioPhase, ctx: ScenarioContext, step: Step) => Promise<void> | void
  }
  dsl: Record<string, (ctx: ScenarioContext, payload: any) => Promise<void> | void>
}

// type ScenarioStepFn = (description: string, payload: any) => Step

// export const given: ScenarioStepFn = (description, payload) => ({ type: 'given', description, payload })
// export const when: ScenarioStepFn = (description, payload) => ({ type: 'when', description, payload })
// export const then: ScenarioStepFn = (description, payload) => ({ type: 'then', description, payload })

export function createScenarioTest(config: ScenarioTestConfig): void {
//   return async (...steps: Step[]) => {
//     const ctx: ScenarioContext = { events: [], commands: [] }

  //     for (const step of steps) {
  //       const handler = config.dsl[step.description]
  //       if (!handler)
  //         throw new Error(`Missing handler for: "${step.description}"`)

  //       await config.hooks?.before?.(step.type, ctx, step)

  //       await handler(ctx, step.payload)

//       await config.hooks?.after?.(step.type, ctx, step)
//     }
//   }
}
