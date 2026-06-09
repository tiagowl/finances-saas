import bcrypt from 'bcrypt';
import { User } from '../../../domain/entities/User.js';
import { ConflictError, DomainError } from '../../../domain/errors/DomainError.js';
import { IUserRepository } from '../../ports/repositories/IUserRepository.js';

export interface UpdateProfileInput {
  userId: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export class UpdateProfileUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(input: UpdateProfileInput): Promise<User> {
    const user = await this.userRepo.findById(input.userId);
    if (!user) {
      throw new DomainError('User not found');
    }

    if (input.email && input.email !== user.email) {
      const existing = await this.userRepo.findByEmail(input.email);
      if (existing) {
        throw new ConflictError('Email already in use');
      }
    }

    let passwordHash: string | undefined;

    if (input.newPassword) {
      if (!input.currentPassword) {
        throw new DomainError('Current password is required to set a new password');
      }
      const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
      if (!valid) {
        throw new DomainError('Current password is incorrect');
      }
      passwordHash = await bcrypt.hash(input.newPassword, 10);
    }

    const updated = await this.userRepo.updateUser(input.userId, {
      email: input.email ? input.email.trim().toLowerCase() : undefined,
      passwordHash,
    });

    return updated;
  }
}
