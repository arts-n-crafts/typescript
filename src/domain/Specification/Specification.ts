export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
}