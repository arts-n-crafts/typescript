import type { QueryNode } from './QueryNode.ts'

export abstract class Specification {
  abstract isSatisfiedBy(entity: unknown): boolean
  abstract toQuery(): QueryNode

  and(other: Specification): Specification {
    return new AndSpecification(this, other)
  }

  or(other: Specification): Specification {
    return new OrSpecification(this, other)
  }

  not(): Specification {
    return new NotSpecification(this)
  }
}

export class AndSpecification extends Specification {
  constructor(private left: Specification, private right: Specification) {
    super()
  }

  isSatisfiedBy(entity: unknown): boolean {
    return this.left.isSatisfiedBy(entity) && this.right.isSatisfiedBy(entity)
  }

  toQuery(): QueryNode {
    return {
      type: 'and',
      nodes: [this.left.toQuery(), this.right.toQuery()],
    }
  }
}

export class OrSpecification extends Specification {
  constructor(private left: Specification, private right: Specification) {
    super()
  }

  isSatisfiedBy(entity: unknown): boolean {
    return this.left.isSatisfiedBy(entity) || this.right.isSatisfiedBy(entity)
  }

  toQuery(): QueryNode {
    return {
      type: 'or',
      nodes: [this.left.toQuery(), this.right.toQuery()],
    }
  }
}

export class NotSpecification extends Specification {
  constructor(private spec: Specification) {
    super()
  }

  isSatisfiedBy(entity: unknown): boolean {
    return !this.spec.isSatisfiedBy(entity)
  }

  toQuery(): QueryNode {
    return {
      type: 'not',
      node: this.spec.toQuery(),
    }
  }
}
