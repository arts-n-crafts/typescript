import type { QueryNode } from './QueryNode.ts'

export abstract class Specification<T> {
  abstract isSatisfiedBy(entity: T): boolean
  abstract toQuery(): QueryNode

  and(other: Specification<T>): Specification<T> {
    return new AndSpecification(this, other)
  }

  or(other: Specification<T>): Specification<T> {
    return new OrSpecification(this, other)
  }

  not(): Specification<T> {
    return new NotSpecification(this)
  }
}

export class AndSpecification<T> extends Specification<T> {
  constructor(private left: Specification<T>, private right: Specification<T>) {
    super()
  }

  isSatisfiedBy(entity: T): boolean {
    return this.left.isSatisfiedBy(entity) && this.right.isSatisfiedBy(entity)
  }

  toQuery(): QueryNode {
    return {
      type: 'and',
      nodes: [this.left.toQuery(), this.right.toQuery()],
    }
  }
}

export class OrSpecification<T> extends Specification<T> {
  constructor(private left: Specification<T>, private right: Specification<T>) {
    super()
  }

  isSatisfiedBy(entity: T): boolean {
    return this.left.isSatisfiedBy(entity) || this.right.isSatisfiedBy(entity)
  }

  toQuery(): QueryNode {
    return {
      type: 'or',
      nodes: [this.left.toQuery(), this.right.toQuery()],
    }
  }
}

export class NotSpecification<T> extends Specification<T> {
  constructor(private spec: Specification<T>) {
    super()
  }

  isSatisfiedBy(entity: T): boolean {
    return !this.spec.isSatisfiedBy(entity)
  }

  toQuery(): QueryNode {
    return {
      type: 'not',
      node: this.spec.toQuery(),
    }
  }
}
