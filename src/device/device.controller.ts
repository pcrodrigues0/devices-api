import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DeviceDto, FindAllParameters } from './device.dto';
import { DeviceService } from './device.service';

@Controller('v1/device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  async create(@Body() device: DeviceDto): Promise<DeviceDto> {
    const createdDevice = await this.deviceService.create(device);
    return createdDevice;
  }

  @Put()
  update(@Body() device: DeviceDto) {
    this.deviceService.update(device);
    return device;
  }

  @Get('/:id')
  findById(@Param('id') id: number): Promise<DeviceDto> {
    return this.deviceService.findById(id);
  }

  @Get()
  findAll(@Query() params: FindAllParameters): DeviceDto[] {
    return this.deviceService.findAll(params);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    this.deviceService.remove(id);
    return { message: 'Device deleted successfully' };
  }
}
