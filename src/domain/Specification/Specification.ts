export abstract class Specification<T = unknown> {
  abstract isSatisfiedBy(candidate: T): boolean;
  abstract toQuery( ...args: unknown[] ): string;
}
