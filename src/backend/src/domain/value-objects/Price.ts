import { DomainError } from '../errors/DomainError.js';

export class Price {
  private constructor(private readonly _value: number) {}

  static create(value: number): Price {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new DomainError('Price must be a valid number');
    }
    if (value <= 0) {
      throw new DomainError('Price must be greater than zero');
    }
    if (value > 9999999.99) {
      throw new DomainError('Price exceeds maximum allowed value');
    }
    return new Price(Math.round(value * 100) / 100);
  }

  get value(): number {
    return this._value;
  }

  equals(other: Price): boolean {
    return this._value === other.value;
  }

  toJSON(): number {
    return this._value;
  }
}
