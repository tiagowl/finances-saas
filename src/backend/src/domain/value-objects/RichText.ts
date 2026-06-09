export class RichText {
  private constructor(private readonly _value: string | null) {}

  static create(value?: string | null): RichText {
    if (value === null || value === undefined || value.trim() === '') {
      return new RichText(null);
    }
    return new RichText(value.trim());
  }

  get value(): string | null {
    return this._value;
  }

  get isEmpty(): boolean {
    return this._value === null;
  }

  toJSON(): string | null {
    return this._value;
  }
}
