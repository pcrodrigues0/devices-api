import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeviceDto, FindAllParameters } from './device.dto';

@Injectable()
export class DeviceService {
  private devices: DeviceDto[] = [];

  create(device: DeviceDto) {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    device.creationTime = timestamp;
    this.devices.push(device);
  }

  update(device: DeviceDto) {
    const deviceIndex = this.devices.findIndex((d) => d.id === device.id);
    if (deviceIndex >= 0) {
      this.devices[deviceIndex] = device;
      return;
    }

    throw new HttpException(
      `Device with id ${device.id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }

  findById(id: string): DeviceDto {
    const foundDevice = this.devices.filter((d) => d.id === id);

    if (foundDevice.length) return foundDevice[0];

    throw new HttpException(
      `Device with id ${id} not found`,
      HttpStatus.NOT_FOUND,
    );
  }

  findAll(params: FindAllParameters): DeviceDto[] {
    console.log('params', params);
    return this.devices.filter((d) => {
      let match = true;
      if (params.brand != undefined && d.brand !== params.brand) {
        match = false;
      }
      if (params.state != undefined && d.state !== params.state) {
        match = false;
      }
      return match;
    });
  }

  remove(id: string) {
    const deviceIndex = this.devices.findIndex((d) => d.id === id);
    if (deviceIndex >= 0) {
      this.devices.splice(deviceIndex, 1);
      return;
    }

    throw new HttpException(
      `Device with id ${id} not found`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
