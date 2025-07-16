import { createQueryNode } from './createQueryNode.ts'

describe('createQueryNode', () => {
  it('creates eq node', () => {
    const node = createQueryNode('eq', 'status', 'active')
    expect(node).toEqual({ type: 'eq', field: 'status', value: 'active' })
  })

  it('creates gt node', () => {
    const node = createQueryNode('gt', 'score', 10)
    expect(node).toEqual({ type: 'gt', field: 'score', value: 10 })
  })

  it('creates lt node', () => {
    const node = createQueryNode('lt', 'level', 5)
    expect(node).toEqual({ type: 'lt', field: 'level', value: 5 })
  })

  it('creates and node', () => {
    const a = createQueryNode('eq', 'role', 'admin')
    const b = createQueryNode('gt', 'age', 30)
    const node = createQueryNode('and', undefined, [a, b])
    expect(node).toEqual({ type: 'and', nodes: [a, b] })
  })

  it('creates or node', () => {
    const a = createQueryNode('eq', 'status', 'active')
    const b = createQueryNode('eq', 'status', 'pending')
    const node = createQueryNode('or', undefined, [a, b])
    expect(node).toEqual({ type: 'or', nodes: [a, b] })
  })

  it('creates not node', () => {
    const inner = createQueryNode('eq', 'deleted', true)
    const node = createQueryNode('not', undefined, inner)
    expect(node).toEqual({ type: 'not', node: inner })
  })
})
