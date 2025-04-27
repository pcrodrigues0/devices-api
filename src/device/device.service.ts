import { Injectable } from '@nestjs/common';
import { DeviceDto } from './device.dto';

@Injectable()
export class DeviceService {
  private devices: DeviceDto[] = [];

  create(device: DeviceDto) {
    this.devices.push(device);
    console.log(this.devices);
  }
}
