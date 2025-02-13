import type { Specification } from "./Specification";

export class NotSpecification<T> implements Specification<T> {
  constructor(
    private spec: Specification<T>,
  ) {}
  isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate);
  }
  
  toQuery(..._args: unknown[]): string {
    throw new Error("Method not implemented.");
  }
}
