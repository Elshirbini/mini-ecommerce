import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export enum ServiceSortBy {
  LOWEST_PRICE = 'lowestPrice',
  HIGHEST_PRICE = 'highestPrice',
  HIGHEST_RATING = 'highestRating',
}

export class QueryParamsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  teacherId?: string | Types.ObjectId;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  stage?: string;

  @IsOptional()
  @IsString()
  classes?: string | object;

  @IsOptional()
  @IsString()
  materials?: string | object;

  @IsOptional()
  @IsString()
  academicSpecialization?: string;

  @IsOptional()
  @IsString()
  courses?: string | object;

  @IsOptional()
  @IsString()
  targetGroup?: string | object;

  @IsOptional()
  @IsString()
  services?: string | object;

  @IsOptional()
  @IsString()
  subDepartment?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isHighlighted?: boolean;

  @IsOptional()
  highlightedTo?: object;

  @IsOptional()
  @IsEnum(ServiceSortBy)
  sortBy?: ServiceSortBy;
}
