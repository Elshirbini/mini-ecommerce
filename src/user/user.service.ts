import { Injectable, NotFoundException } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { User, UserDocument } from './schemas/user.schema';
import { RedisService } from 'src/redis/redis.service';
import { GraphQLContext } from 'src/graphql/graphql-context';
import { UserFilterInput } from './graphql/user-filter.input';
import { UsersResponse } from './graphql/users-response.type';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cacheService: RedisService,
  ) {}

  async create(userData: Partial<User>): Promise<UserDocument> {
    return this.userRepository.create(userData);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userRepository.findByEmail(email);
  }

  async getUser(ctx: GraphQLContext): Promise<UserDocument> {
    const userId = ctx.request.userId!;
    const cacheKey = `cache:user:${userId}`;
    const cachedUser = await this.cacheService.get(cacheKey);
    if (cachedUser) {
      console.log(`Cache hit for user with ID ${userId}`);
      return JSON.parse(cachedUser) as UserDocument;
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    console.log(`Cache Miss for user with ID ${userId}`);
    await this.cacheService.set(cacheKey, JSON.stringify(user), 600);
    return user;
  }

  async getUsers(filter: UserFilterInput): Promise<UsersResponse> {
    const { users, totalCount } =
      await this.userRepository.findAllUsers(filter);
    return {
      users: users.map((user) => UserMapper.toGraphQL(user)),

      meta: {
        totalCount,
        page: filter.page,
        limit: filter.limit,
      },
    };
  }
}
