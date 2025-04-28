import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'ID of the device',
    minimum: 1,
    type: 'number',
  })
  id: number;

  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @ApiProperty({
    description: 'Description of the device',
    minLength: 3,
    maxLength: 256,
  })
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @ApiProperty({
    description: 'Brand of the device',
    minLength: 3,
    maxLength: 256,
  })
  brand: string;

  @IsEnum(DeviceStateEnum)
  @ApiProperty({ description: 'State of the device', enum: DeviceStateEnum })
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
  @ApiProperty({
    description: 'Description of the device',
    minLength: 3,
    maxLength: 256,
  })
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @IsOptional()
  @ApiProperty({
    description: 'Brand of the device',
    minLength: 3,
    maxLength: 256,
  })
  brand: string;

  @IsEnum(DeviceStateEnum)
  @IsOptional()
  @ApiProperty({ description: 'State of the device', enum: DeviceStateEnum })
  state: DeviceStateEnum;
}

export interface FindAllParameters {
  brand?: string;
  state?: DeviceStateEnum;
  page?: number;
  limit?: number;
}

export class DeviceRouterParameters {
  id: number;
}
