import { describe, expect, it } from 'vitest'
import { User } from './examples/User'

describe('user', () => {
  it('should be defined', () => {
    expect(User).toBeDefined()
  })

  it('should succeed to create a User', () => {
    const id = '123'
    const props = {
      username: 'elon',
      email: 'elon@x.com',
    }
    const mockUser = User.create(props, id)
    expect(mockUser).toBeInstanceOf(User)
    expect(mockUser.id).toBe(id)
    expect(mockUser.props).toEqual(props)
  })

  it('should succeed to compare two Users', () => {
    const id = '123'
    const props = { username: 'elon', email: 'elon@x.com' }
    const mockUser1 = User.create(props, id)
    const mockUser2 = User.create(props, id)
    expect(mockUser1.equals(mockUser2)).toBe(true)
  })

  it('should fail to compare two Users', () => {
    const id = '123'
    const props = { username: 'elon', email: 'elon@x.com' }
    const mockUser1 = User.create(props, id)
    const mockUser2 = User.create(props, '124')
    expect(mockUser1.equals(mockUser2)).toBe(false)
  })
})
