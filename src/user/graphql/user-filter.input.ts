import { Field, InputType, Int } from '@nestjs/graphql';
import { UserRole } from '../enums/userRole.enum';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class UserFilterInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsNotEmpty()
  page!: number;

  @Field(() => Int, { defaultValue: 10 })
  @IsNotEmpty()
  limit!: number;

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  role?: UserRole;
}
