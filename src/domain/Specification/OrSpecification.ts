import type { Specification } from "./Specification";

export class OrSpecification<T> implements Specification<T> {
  constructor(
    private spec1: Specification<T>,
    private spec2: Specification<T>
  ) {}

  isSatisfiedBy(entity: T): boolean {
    return this.spec1.isSatisfiedBy(entity)
      || this.spec2.isSatisfiedBy(entity);
  }
}
