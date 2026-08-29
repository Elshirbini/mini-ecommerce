// product.schema.ts

import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ _id: false })
export class ProductImage {
  @Prop({ required: true })
  imageKey!: string;

  @Prop({ required: true })
  imageUrl!: string;
}

export const ProductImageSchema = SchemaFactory.createForClass(ProductImage);

@Schema({ timestamps: true })
export class Product {
  _id!: Types.ObjectId;

  @AutoMap()
  @Prop({ required: true, trim: true })
  title!: string;

  @AutoMap()
  @Prop({ required: true, trim: true })
  description!: string;

  @AutoMap()
  @Prop({ required: true, min: 0 })
  price!: number;

  @AutoMap()
  @Prop({ required: true, min: 0 })
  quantity!: number;

  @AutoMap()
  @Prop({
    type: ProductImageSchema,
  })
  thumbnail?: ProductImage;

  @AutoMap()
  @Prop({
    type: [ProductImageSchema],
    default: [],
  })
  images?: ProductImage[];

  @AutoMap()
  @Prop({ required: true, min: 0, max: 100, default: 0 })
  discount!: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
