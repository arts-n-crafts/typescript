import type { QueryNode } from '../QueryNode.ts'
import { fail } from '@utils/fail/fail.ts'
import { invariant } from '@utils/invariant/invariant.ts'
import { CompositeSpecification } from '../Specification.ts'
import { createQueryNode } from '../utils/createQueryNode.ts'

export class FieldGreaterThan<T> extends CompositeSpecification<T> {
  constructor(
    private field: keyof T,
    private value: number,
  ) {
    super()
  }

  private isNumber(value: unknown): value is number {
    return typeof value === 'number'
  }

  isSatisfiedBy(entity: T): boolean {
    const field = entity[this.field]
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
