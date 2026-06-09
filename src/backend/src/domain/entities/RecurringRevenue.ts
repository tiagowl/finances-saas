import { DomainError } from '../errors/DomainError.js';
import { Price } from '../value-objects/Price.js';
import { RichText } from '../value-objects/RichText.js';

export interface CreateRecurringRevenueProps {
  id?: string;
  name: string;
  notes?: string | null;
  price: number;
  installments?: number | null;
  categoryId?: string | null;
  userId: string;
}

export class RecurringRevenue {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _notes: RichText,
    private _price: Price,
    private _installments: number | null,
    private _categoryId: string | null,
    private _userId: string,
  ) {}

  static create(props: CreateRecurringRevenueProps): RecurringRevenue {
    if (!props.name || props.name.trim().length < 2) {
      throw new DomainError('Revenue name must have at least 2 characters');
    }
    if (props.name.trim().length > 200) {
      throw new DomainError('Revenue name must have at most 200 characters');
    }
    if (!props.userId) {
      throw new DomainError('User is required');
    }

    return new RecurringRevenue(
      props.id ?? crypto.randomUUID(),
      props.name.trim(),
      RichText.create(props.notes),
      Price.create(props.price),
      props.installments ?? null,
      props.categoryId ?? null,
      props.userId,
    );
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get notes(): string | null { return this._notes.value; }
  get price(): number { return this._price.value; }
  get installments(): number | null { return this._installments; }
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

  changeInstallments(installments: number | null): void {
    this._installments = installments;
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
      installments: this._installments,
      categoryId: this._categoryId,
      userId: this._userId,
    };
  }
}
