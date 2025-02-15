import type { FilledArray } from "../../core/types/FilledArray";
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
  
  toQuery(): FilledArray {
    return [...this.left.toQuery(), ...this.right.toQuery()];
  }
}
