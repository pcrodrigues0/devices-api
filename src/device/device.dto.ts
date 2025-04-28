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

  @IsString()
  @IsOptional()
  creationTime: string;
}

export class DeviceUpdateDto {
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @IsOptional()
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @IsOptional()
  brand: string;

  @IsEnum(DeviceStateEnum)
  @IsOptional()
  state: DeviceStateEnum;
}

export interface FindAllParameters {
  brand?: string;
  state?: DeviceStateEnum;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc'; // default is 'asc'
}

export class DeviceRouterParameters {
  id: number;
}
