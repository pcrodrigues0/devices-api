import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeviceDto } from './device.dto';

@Injectable()
export class DeviceService {
  private devices: DeviceDto[] = [];

  create(device: DeviceDto) {
    this.devices.push(device);
    console.log(this.devices);
  }

  update(device: DeviceDto) {
    const deviceIndex = this.devices.findIndex((d) => d.id === device.id);
    if (deviceIndex >= 0) {
      this.devices[deviceIndex] = device;
      return;
    }

    throw new HttpException(
      `Task with id ${device.id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  findById(id: string): DeviceDto {
    const foundDevice = this.devices.filter((d) => d.id === id);

    if (foundDevice.length) return foundDevice[0];

    throw new HttpException(
      `Task with id ${id} not found`,
      HttpStatus.NOT_FOUND,
    );
  }
}
