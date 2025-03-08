/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { validate } from 'class-validator';
// import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityManager } from '@mikro-orm/mysql';
import { UserRepository } from './user.repository';
import { IUserRO } from './user.interface';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const SECRET = configService.get<string>('SECRET') || 'default_secret';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly em: EntityManager,
  ) {
    this.logger.log('UsersService Initialized');
  }

  async create(createUserDto: CreateUserDto): Promise<IUserRO> {
    try {
      const { email, username, provider, providerId, avatarUrl } =
        createUserDto;
      const exists = await this.userRepository.count({
        $or: [{ username }, { email }],
      });

      if (exists > 0) {
        throw new HttpException(
          {
            message: 'Input data validation failed',
            errors: { username: 'Username and email must be unique.' },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Create new user instance; note that the User constructor expects no arguments.
      const user = new User();
      user.email = email;
      user.username = username;
      user.provider = provider;
      user.providerId = providerId;
      user.avatarUrl = avatarUrl;
      user.role = UserRole.USER; // default role

      const errors = await validate(user);
      if (errors.length > 0) {
        throw new HttpException(
          {
            message: 'Input data validation failed',
            errors: { user: 'User input is not valid.' },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.em.persistAndFlush(user);
      return this.buildUserRO(user);
    } catch (error) {
      this.logger.error('Error creating user:', error);
      // If error is already an HttpException, rethrow it; otherwise, throw a generic Internal Server Error.
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async findAll(): Promise<IUserRO[]> {
    try {
      const users = await this.em.find(User, {});
      return users.map((user) => this.buildUserRO(user));
    } catch (error) {
      this.logger.error(
        'Error finding all users:',
        error instanceof Error ? error.message : error,
      );
      throw new HttpException(
        'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<IUserRO> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new HttpException(
        { message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    return this.buildUserRO(user);
  }

  async findByEmail(email: string): Promise<IUserRO> {
    const user = await this.userRepository.findOneOrFail({ email });
    return this.buildUserRO(user);
  }

  generateJWT(user: User) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return jwt.sign(
      {
        email: user.email,
        exp: exp.getTime() / 1000,
        id: user.id,
        username: user.username,
      },
      SECRET,
    );
  }

  private buildUserRO(user: User): IUserRO {
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        provider: user.provider,
        providerId: user.providerId,
        avatarUrl: user.avatarUrl,
        role: user.role,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        token: this.generateJWT(user),
      },
    };
  }
}
