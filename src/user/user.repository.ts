import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types, UpdateQuery } from 'mongoose';
import { UserDocument, User } from './schemas/user.schema';
import { UserFilterInput } from './graphql/user-filter.input';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private User: Model<UserDocument>) {}

  async create(userData: Partial<User>): Promise<UserDocument> {
    const createdUser = new this.User(userData);
    return createdUser.save();
  }

  async updateUserByQuery(query: QueryFilter<User>, data: UpdateQuery<User>) {
    return this.User.findOneAndUpdate(query, data, {
      runValidators: true,
      returnDocument: 'after',
    });
  }

  async findUserByIdAndUpdate(id: string, data: QueryFilter<User>) {
    return this.User.findByIdAndUpdate(id, data, {
      runValidators: true,
      returnDocument: 'after',
    });
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.User.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.User.findById(id).exec();
  }

  async findAllUsers(filter: UserFilterInput) {
    const limit = filter.limit !== undefined ? Number(filter.limit) : 10;

    const queryFilter: QueryFilter<User> = {};

    if (filter.search) {
      queryFilter.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { email: { $regex: filter.search, $options: 'i' } },
      ];
    }

    if (filter.after) {
      queryFilter._id = { $gt: new Types.ObjectId(filter.after) };
    }

    const findQuery = this.User.find(queryFilter)
      .sort({ _id: 1 })
      .limit(limit + 1);

    const [users, totalCount] = await Promise.all([
      findQuery.exec(),
      this.User.countDocuments(queryFilter).exec(),
    ]);

    const hasNextPage = users.length > limit;
    const items = hasNextPage ? users.slice(0, limit) : users;

    return {
      users: items,
      hasNextPage,
      endCursor:
        items.length > 0 ? items[items.length - 1]._id.toString() : undefined,
      totalCount,
    };
  }
  // async findAllUsers(filter: UserFilterInput) {
  //   const page = filter.page ? Number(filter.page) : 1;
  //   const limit = filter.limit !== undefined ? Number(filter.limit) : 10;

  //   const queryFilter: QueryFilter<User> = {};

  //   if (filter.search) {
  //     queryFilter.$or = [
  //       { name: { $regex: filter.search, $options: 'i' } },
  //       { email: { $regex: filter.search, $options: 'i' } },
  //     ];
  //   }
  //   const findQuery = this.User.find(queryFilter);

  //   if (limit > 0) {
  //     findQuery.skip((page - 1) * limit).limit(limit);
  //   }

  //   const [users, totalCount] = await Promise.all([
  //     findQuery.exec(),
  //     this.User.countDocuments(queryFilter).exec(),
  //   ]);

  //   return {
  //     users,
  //     totalCount,
  //   };
  // }
}
