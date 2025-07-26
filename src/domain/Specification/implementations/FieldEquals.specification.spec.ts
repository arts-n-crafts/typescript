import { FieldEquals } from './FieldEquals.specification.ts'

interface User { status: string, age: number }

describe('field specs', () => {
  const active = new FieldEquals<User>('status', 'active')

  const user1 = { status: 'active', age: 25 }
  const user2 = { status: 'inactive', age: 17 }

  it('fieldEquals matches correctly', () => {
    expect(active.isSatisfiedBy(user1)).toBe(true)
    expect(active.isSatisfiedBy(user2)).toBe(false)
  })
})
