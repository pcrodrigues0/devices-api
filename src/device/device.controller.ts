import { Body, Controller, Post } from '@nestjs/common';
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
}
