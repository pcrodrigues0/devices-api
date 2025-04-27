import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DeviceDto } from './device.dto';
import { DeviceService } from './device.service';

@Controller('v1/device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  create(@Body() device: DeviceDto) {
    this.deviceService.create(device);
    return device;
  }

  @Put()
  update(@Body() device: DeviceDto) {
    this.deviceService.update(device);
    return device;
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.deviceService.findById(id);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    this.deviceService.remove(id);
    return { message: 'Device deleted successfully' };
  }
}
