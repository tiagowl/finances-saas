import bcrypt from 'bcrypt';
import { User } from '../../../domain/entities/User.js';
import { DomainError } from '../../../domain/errors/DomainError.js';
import { IUserRepository } from '../../ports/repositories/IUserRepository.js';

export interface LoginInput {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(input: LoginInput): Promise<User> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) {
      throw new DomainError('Invalid email or password');
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new DomainError('Invalid email or password');
    }

    return user;
  }
}
