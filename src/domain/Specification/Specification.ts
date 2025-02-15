export abstract class Specification<T = unknown> {
  abstract isSatisfiedBy(candidate: T): boolean;
  abstract toQuery(): Record<string, unknown>;
}
