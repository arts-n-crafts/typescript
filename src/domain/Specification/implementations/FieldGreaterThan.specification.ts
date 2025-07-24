import type { QueryNode } from '../QueryNode.ts'
import { fail } from '@utils/fail/fail.ts'
import { invariant } from '@utils/invariant/invariant.ts'
import { Specification } from '../Specification.ts'
import { createQueryNode } from '../utils/createQueryNode.ts'

export class FieldGreaterThan extends Specification {
  constructor(
    private field: string,
    private value: number,
  ) {
    super()
  }

  private isNumber(value: unknown): value is number {
    return typeof value === 'number'
  }

  isSatisfiedBy(entity: unknown): boolean {
    if (entity === null)
      return false
    if (typeof entity !== 'object')
      return false
    if (!(this.field in entity))
      return false

    const field = entity[this.field as keyof typeof entity]
    invariant(
      this.isNumber(field),
      fail(new TypeError(`Field ${String(this.field)} is not a number`),
      ),
    )
    return field > this.value
  }

  toQuery(): QueryNode {
    return createQueryNode('gt', this.field, this.value)
  }
}
