import { DomainError } from '../errors/DomainError.js';
import { RichText } from '../value-objects/RichText.js';

export interface CreateCategoryProps {
  id?: string;
  name: string;
  notes?: string | null;
  maxBudget?: number | null;
  userId: string;
}

export class Category {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _notes: RichText,
    private _maxBudget: number | null,
    private _userId: string,
  ) {}

  static create(props: CreateCategoryProps): Category {
    if (!props.name || props.name.trim().length < 2) {
      throw new DomainError('Category name must have at least 2 characters');
    }
    if (props.name.trim().length > 100) {
      throw new DomainError('Category name must have at most 100 characters');
    }
    if (props.maxBudget !== null && props.maxBudget !== undefined && props.maxBudget < 0) {
      throw new DomainError('Max budget must be a positive value');
    }
    if (!props.userId) {
      throw new DomainError('User is required');
    }

    return new Category(
      props.id ?? crypto.randomUUID(),
      props.name.trim(),
      RichText.create(props.notes),
      props.maxBudget ?? null,
      props.userId,
    );
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get notes(): string | null { return this._notes.value; }
  get maxBudget(): number | null { return this._maxBudget; }
  get userId(): string { return this._userId; }

  changeName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new DomainError('Category name must have at least 2 characters');
    }
    this._name = name.trim();
  }

  changeNotes(notes?: string | null): void {
    this._notes = RichText.create(notes);
  }

  changeMaxBudget(maxBudget?: number | null): void {
    if (maxBudget !== null && maxBudget !== undefined && maxBudget < 0) {
      throw new DomainError('Max budget must be a positive value');
    }
    this._maxBudget = maxBudget ?? null;
  }

  isBudgetExceeded(currentSpending: number): boolean {
    return this._maxBudget !== null && currentSpending > this._maxBudget;
  }

  budgetUsagePercentage(currentSpending: number): number {
    if (this._maxBudget === null || this._maxBudget === 0) return 0;
    return (currentSpending / this._maxBudget) * 100;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      notes: this._notes.toJSON(),
      maxBudget: this._maxBudget,
      userId: this._userId,
    };
  }
}
