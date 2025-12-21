import type { QueryNode } from './QueryNode.ts'

export interface Specification<T> {
  isSatisfiedBy(entity: T): boolean
}

export abstract class CompositeSpecification<T> implements Specification<T> {
  abstract isSatisfiedBy(entity: T): boolean

  abstract toQuery(): QueryNode

  and(other: CompositeSpecification<T>): CompositeSpecification<T> {
    return new AndSpecification(this, other)
  }

  or(other: CompositeSpecification<T>): CompositeSpecification<T> {
    return new OrSpecification(this, other)
  }

  not(): CompositeSpecification<T> {
    return new NotSpecification(this)
  }
}

export class AndSpecification<T> extends CompositeSpecification<T> {
  constructor(private left: CompositeSpecification<T>, private right: CompositeSpecification<T>) {
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

export class OrSpecification<T> extends CompositeSpecification<T> {
  constructor(private left: CompositeSpecification<T>, private right: CompositeSpecification<T>) {
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

export class NotSpecification<T> extends CompositeSpecification<T> {
  constructor(private spec: CompositeSpecification<T>) {
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
