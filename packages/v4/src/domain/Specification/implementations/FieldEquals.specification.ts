import type { Primitive } from '@core/types/Primitive.ts'
import type { QueryNode } from '../QueryNode.ts'
import { CompositeSpecification } from '../Specification.ts'
import { createQueryNode } from '../utils/createQueryNode.ts'

export class FieldEquals<T> extends CompositeSpecification<T> {
  constructor(private field: keyof T, private value: Primitive) {
    super()
  }

  isSatisfiedBy(entity: T): boolean {
    return entity[this.field] === this.value
  }

  toQuery(): QueryNode {
    return createQueryNode('eq', this.field, this.value)
  }
}
