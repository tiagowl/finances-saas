import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterUseCase } from '../../application/use-cases/auth/RegisterUseCase.js';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase.js';
import { UpdateProfileUseCase } from '../../application/use-cases/auth/UpdateProfileUseCase.js';
import { registerSchema, loginSchema, updateProfileSchema } from '../validators/auth.validator.js';

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  async register(request: FastifyRequest, reply: FastifyReply) {
    const input = registerSchema.parse(request.body);
    const user = await this.registerUseCase.execute(input);

    const token = await reply.jwtSign({ id: user.id, email: user.email, role: user.role });

    return reply.status(201).send({
      user: user.toJSON(),
      token,
    });
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const input = loginSchema.parse(request.body);
    const user = await this.loginUseCase.execute(input);

    const token = await reply.jwtSign({ id: user.id, email: user.email, role: user.role });

    return reply.send({
      user: user.toJSON(),
      token,
    });
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    await request.jwtVerify();
    const userId = (request.user as { id: string }).id;
    const input = updateProfileSchema.parse(request.body);

    const user = await this.updateProfileUseCase.execute({ userId, ...input });

    const token = await reply.jwtSign({ id: user.id, email: user.email, role: user.role });

    return reply.send({
      user: user.toJSON(),
      token,
    });
  }
}
