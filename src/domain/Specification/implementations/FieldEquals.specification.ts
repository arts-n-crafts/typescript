import type { Primitive } from '@core/types/Primitive.ts'
import type { QueryNode } from '../QueryNode.ts'
import { Specification } from '../Specification.ts'
import { createQueryNode } from '../utils/createQueryNode.ts'

export class FieldEquals extends Specification {
  constructor(private field: string, private value: Primitive) {
    super()
  }

  isSatisfiedBy(entity: unknown): boolean {
    if (entity === null)
      return false
    if (typeof entity !== 'object')
      return false
    if (!(this.field in entity))
      return false

    const field = entity[this.field as keyof typeof entity]
    return field === this.value
  }

  toQuery(): QueryNode {
    return createQueryNode('eq', this.field, this.value)
  }
}
