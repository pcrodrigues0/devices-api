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
  DeviceUpdateDto,
  FindAllParameters,
} from './device.dto';
import { DeviceService } from './device.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('devices')
@Controller('v1/device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new device' })
  async create(@Body() device: DeviceDto): Promise<DeviceDto> {
    const createdDevice = await this.deviceService.create(device);
    return createdDevice;
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a device by an informed ID' })
  async update(
    @Param() params: DeviceRouterParameters,
    @Body() device: DeviceUpdateDto,
  ) {
    await this.deviceService.update(params.id, device);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a device by an informed ID' })
  findById(@Param('id') id: number): Promise<DeviceDto> {
    return this.deviceService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get a device by filters' })
  @ApiParam({
    name: 'brand',
    description: 'Can provide an especific brand',
    allowEmptyValue: true,
  })
  @ApiParam({
    name: 'state',
    description: 'Can provide an especific state',
    allowEmptyValue: true,
  })
  @ApiParam({
    name: 'page',
    description: 'Request an especific page default 1',
    allowEmptyValue: true,
  })
  @ApiParam({
    name: 'limit',
    description: 'Request an especific pagination limit default 1',
    allowEmptyValue: true,
  })
  findAll(@Query() params: FindAllParameters): Promise<DeviceDto[]> {
    return this.deviceService.findAll(params);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete an especific device' })
  async delete(@Param('id') id: number) {
    await this.deviceService.remove(id);
    return { message: 'Device deleted successfully' };
  }
}
