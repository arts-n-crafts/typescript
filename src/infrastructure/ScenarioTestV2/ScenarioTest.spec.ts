import type { ScenarioTestConfig } from './ScenarioTest.ts'
import {
  createScenarioTest,

  // given,
  // then,
  // when
} from './ScenarioTest.ts'

describe('scenario test', () => {
  it('should be defined ', () => {
    expect(createScenarioTest).toBeDefined()
    // expect(given).toBeDefined()
    // expect(when).toBeDefined()
    // expect(then).toBeDefined()
  })

  it('should return nothing', () => {
    expect(createScenarioTest({} as ScenarioTestConfig)).toBeUndefined()
  })

  // let scenario: ReturnType<typeof createScenarioTest>

  // beforeAll(() => {
  //   scenario = createScenarioTest({
  //     testRunnerAdapter: {
  //       equals(actual, expected, msg) {
  //         expect(actual).toEqual(expected) // vitest adapter
  //       },
  //     },
  //     hooks: {
  //       before(phase, ctx, step) {
  //         console.log(`➡️ ${phase.toUpperCase()}: ${step.description}`)
  //       },
  //       after(phase, ctx, step) {
  //         console.log(`✅ Done: ${step.description}`)
  //       },
  //     },
  //     dsl: {
  //       'a user is registered': async (ctx, payload) => {
  //         ctx.events.push({ type: 'UserRegistered', ...payload })
  //       },
  //       'the user changes the associated email': async (ctx, payload) => {
  //         ctx.commands.push({ type: 'ChangeEmail', ...payload })
  //         ctx.events.push({ type: 'UserEmailChanged', ...payload })
  //       },
  //       'the users email was updated': async (ctx, expected) => {
  //         const actual = ctx.events.find(e => e.type === 'UserEmailChanged')
  //         expect(actual).toMatchObject(expected)
  //       },
  //     },
  //   })
  // })

  // it('registers a user and updates email', async () => {
  //   await scenario(
  //     given('a user is registered', { id: '123', name: 'elon', email: 'elon@x.com' }),
  //     when('the user changes the associated email', { id: '123', email: 'donald@x.com' }),
  //     then('the users email was updated', { id: '123', email: 'donald@x.com' }),
  //   )
  // })
})
