import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum DeviceStateEnum {
  AVAILABLE = 'available',
  IN_USE = 'in-use',
  INACTIVE = 'inactive',
}

export class DeviceDto {
  @IsNumber()
  id: number;

  @IsString()
  @MinLength(3)
  @MaxLength(256)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(256)
  brand: string;

  @IsEnum(DeviceStateEnum)
  state: DeviceStateEnum;

  @IsNumber()
  @IsOptional()
  creationTime: number;
}

export interface FindAllParameters {
  brand?: string;
  state?: DeviceStateEnum;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc'; // default is 'asc'
}
