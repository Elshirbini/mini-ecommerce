import { AutoMap } from '@automapper/classes';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
class Image {
  @Field()
  imageKey!: string;

  @Field()
  imageUrl!: string;
}

@ObjectType()
export class Product {
  @AutoMap()
  @Field(() => ID)
  productId!: string;

  @AutoMap()
  @Field()
  title!: string;

  @AutoMap()
  @Field()
  description!: string;

  @AutoMap()
  @Field(() => Number)
  price!: number;

  @AutoMap()
  @Field(() => Int)
  discount!: number;

  @AutoMap()
  @Field(() => Int)
  quantity!: number;

  @AutoMap(() => Image)
  @Field(() => Image, { nullable: true })
  thumbnail?: Image;

  @AutoMap(() => [Image])
  @Field(() => [Image], { nullable: true })
  images?: Image[];
}
