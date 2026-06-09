import { DomainError } from '../errors/DomainError.js';
import { Price } from '../value-objects/Price.js';
import { RichText } from '../value-objects/RichText.js';

export interface CreateOccasionalRevenueProps {
  id?: string;
  name: string;
  notes?: string | null;
  price: number;
  date: Date;
  categoryId?: string | null;
  userId: string;
}

export class OccasionalRevenue {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _notes: RichText,
    private _price: Price,
    private _date: Date,
    private _categoryId: string | null,
    private _userId: string,
  ) {}

  static create(props: CreateOccasionalRevenueProps): OccasionalRevenue {
    if (!props.name || props.name.trim().length < 2) {
      throw new DomainError('Revenue name must have at least 2 characters');
    }
    if (props.name.trim().length > 200) {
      throw new DomainError('Revenue name must have at most 200 characters');
    }
    if (!props.date) {
      throw new DomainError('Date is required');
    }
    if (!props.userId) {
      throw new DomainError('User is required');
    }

    return new OccasionalRevenue(
      props.id ?? crypto.randomUUID(),
      props.name.trim(),
      RichText.create(props.notes),
      Price.create(props.price),
      props.date,
      props.categoryId ?? null,
      props.userId,
    );
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get notes(): string | null { return this._notes.value; }
  get price(): number { return this._price.value; }
  get date(): Date { return this._date; }
  get categoryId(): string | null { return this._categoryId; }
  get userId(): string { return this._userId; }

  changeName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new DomainError('Revenue name must have at least 2 characters');
    }
    this._name = name.trim();
  }

  changeNotes(notes?: string | null): void {
    this._notes = RichText.create(notes);
  }

  changePrice(price: number): void {
    this._price = Price.create(price);
  }

  changeDate(date: Date): void {
    if (!date) throw new DomainError('Date is required');
    this._date = date;
  }

  changeCategory(categoryId: string | null): void {
    this._categoryId = categoryId;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      notes: this._notes.toJSON(),
      price: this._price.toJSON(),
      date: this._date.toISOString(),
      categoryId: this._categoryId,
      userId: this._userId,
    };
  }
}
