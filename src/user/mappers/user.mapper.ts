import { User } from '../graphql/user.type';
import { UserDocument } from '../schemas/user.schema';

export class UserMapper {
  static toGraphQL(user: UserDocument): User {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
