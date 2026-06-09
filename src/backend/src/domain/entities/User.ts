import { DomainError } from '../errors/DomainError.js';

export interface CreateUserProps {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role?: string;
}

export class User {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _email: string,
    private _passwordHash: string,
    private _role: string,
  ) {}

  static create(props: CreateUserProps): User {
    if (!props.name || props.name.trim().length < 2) {
      throw new DomainError('Name must have at least 2 characters');
    }
    if (!props.email || !props.email.includes('@')) {
      throw new DomainError('Valid email is required');
    }
    if (!props.passwordHash) {
      throw new DomainError('Password hash is required');
    }
    return new User(
      props.id ?? crypto.randomUUID(),
      props.name.trim(),
      props.email.trim().toLowerCase(),
      props.passwordHash,
      props.role ?? 'user',
    );
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get email(): string { return this._email; }
  get passwordHash(): string { return this._passwordHash; }
  get role(): string { return this._role; }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      role: this._role,
    };
  }
}
