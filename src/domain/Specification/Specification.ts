export interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export abstract class Specification<T> implements ISpecification<T> {
  abstract isSatisfiedBy(candidate: T): boolean;
}

export class AndSpecification<T> extends Specification<T> {
  isSatisfiedBy(_candidate: T): boolean {
    throw new Error("Method not implemented.");
  }
}
