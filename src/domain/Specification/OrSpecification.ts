import type { Specification } from "./Specification";

export class OrSpecification<T> implements Specification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>
  ) {}

  isSatisfiedBy(entity: T): boolean {
    return this.left.isSatisfiedBy(entity)
      || this.right.isSatisfiedBy(entity);
  }
  
  toQuery(): Array<Record<string, unknown>> {
    throw new Error("Method not implemented.");
  }
}
