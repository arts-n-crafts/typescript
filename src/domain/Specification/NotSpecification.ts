import type { FilledArray } from "../../core/types/FilledArray";
import type { Specification } from "./Specification";

export class NotSpecification<T> implements Specification<T> {
  constructor(
    private spec: Specification<T>,
  ) {}
  isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate);
  }
  
  toQuery(): FilledArray {
    return [...this.spec.toQuery()];
  }
}
