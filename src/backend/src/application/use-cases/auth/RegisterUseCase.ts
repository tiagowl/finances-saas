import bcrypt from 'bcrypt';
import { User } from '../../../domain/entities/User.js';
import { ConflictError } from '../../../domain/errors/DomainError.js';
import { IUserRepository } from '../../ports/repositories/IUserRepository.js';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(input: RegisterInput): Promise<User> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = User.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    return this.userRepo.save(user);
  }
}
