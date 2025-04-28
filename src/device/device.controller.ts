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
import {
  DeviceDto,
  DeviceRouterParameters,
  FindAllParameters,
} from './device.dto';
import { DeviceService } from './device.service';

@Controller('v1/device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  async create(@Body() device: DeviceDto): Promise<DeviceDto> {
    const createdDevice = await this.deviceService.create(device);
    return createdDevice;
  }

  @Put('/:id')
  async update(
    @Param() params: DeviceRouterParameters,
    @Body() device: DeviceDto,
  ) {
    await this.deviceService.update(params.id, device);
  }

  @Get('/:id')
  findById(@Param('id') id: number): Promise<DeviceDto> {
    return this.deviceService.findById(id);
  }

  @Get()
  findAll(@Query() params: FindAllParameters): Promise<DeviceDto[]> {
    return this.deviceService.findAll(params);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    this.deviceService.remove(id);
    return { message: 'Device deleted successfully' };
  }
}
