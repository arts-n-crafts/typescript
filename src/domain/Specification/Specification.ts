import type { FilledArray } from "../../core/types/FilledArray";

export abstract class Specification<T = unknown> {
  abstract isSatisfiedBy(candidate: T): boolean;
  abstract toQuery(): FilledArray;
}
