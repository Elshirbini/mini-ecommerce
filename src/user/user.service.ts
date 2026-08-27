import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { User, UserDocument } from './schemas/user.schema';
import { RedisService } from 'src/redis/redis.service';
import { GraphQLContext } from 'src/graphql/graphql-context';
import { UserFilterInput } from './graphql/user-filter.input';
import { UsersResponse } from './graphql/users-response.type';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { User as MongoUser } from './schemas/user.schema';
import { User as GraphQLUser } from './graphql/user.type';
import { UpdateUserInput } from './graphql/update-user.input';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { CloudflareService } from 'src/cloudflare/cloudflare.service';
import { validateUploadedFile } from 'src/utils/file-validation.util';

@Injectable()
export class UserService {
  logger = new Logger(UserService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cacheService: RedisService,
    private readonly cloudflareR2: CloudflareService,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async create(userData: Partial<User>): Promise<UserDocument> {
    return this.userRepository.create(userData);
  }

  async updateUser(
    ctx: GraphQLContext,
    userData: UpdateUserInput,
    file?: FileUpload,
  ) {
    const userId = ctx.request.userId!;
    let imageKey: string | undefined;
    let imageUrl: string | undefined;

    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (file) {
      this.logger.log('File Recieved');
      const stream = file.createReadStream();

      const chunks: Buffer[] = [];

      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      const buffer = Buffer.concat(chunks);

      const result = await validateUploadedFile(
        buffer,
        {
          allowedMimeTypes: ['image/jpeg', 'image/png'],
          maxSizeInMB: 5,
        },
        file.filename,
      );

      const { key, url } = await this.cloudflareR2.uploadFileS3(
        buffer,
        `profile-pictures/${user.email}/${Date.now()}`,
        result.mime,
      );

      if (user.imageKey) await this.cloudflareR2.deleteFileS3(user.imageKey);

      imageKey = key;
      imageUrl = url;
    }

    const updatedUser = await this.userRepository.updateUserByQuery(
      { _id: user._id },
      { ...userData, imageKey, imageUrl },
    );

    const mappedUser = this.mapper.map(updatedUser, MongoUser, GraphQLUser);
    return { ...mappedUser, fullName: mappedUser.name };
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

    const mappedUsers = this.mapper.mapArray(users, MongoUser, GraphQLUser);

    return {
      users: mappedUsers,
      meta: {
        totalCount,
        page: filter.page,
        limit: filter.limit,
      },
    };
  }
}
