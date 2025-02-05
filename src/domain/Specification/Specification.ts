export interface Specification<T = unknown> {
  isSatisfiedBy(candidate: T): boolean;
}