import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeviceDto, FindAllParameters } from './device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/db/entities/device.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class DeviceService {
  private devices: DeviceDto[] = [];

  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
  ) {}

  async create(device: DeviceDto) {
    const currentDate = new Date();
    const deviceToSave: DeviceEntity = {
      id: device.id,
      name: device.name,
      brand: device.brand,
      state: device.state,
      creationTime: currentDate,
    };
    const createdDevice = await this.deviceRepository.save(deviceToSave);
    return this.mapEntityToDto(createdDevice);
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

  async findById(id: number): Promise<DeviceDto> {
    const foundDevice = await this.deviceRepository.findOne({
      where: { id: id },
    });

    if (!foundDevice) {
      throw new HttpException(
        `Device with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return this.mapEntityToDto(foundDevice);
  }

  async findAll(params: FindAllParameters): Promise<DeviceDto[]> {
    const searchParams: FindOptionsWhere<DeviceEntity> = {};
    if (params.brand) searchParams.brand = params.brand;
    if (params.state) searchParams.state = params.state;

    const devicesFound = await this.deviceRepository.find({
      where: searchParams,
    });
    return devicesFound.map((deviceEntity) =>
      this.mapEntityToDto(deviceEntity),
    );
  }

  remove(id: number) {
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

  private mapEntityToDto(device: DeviceEntity): DeviceDto {
    return {
      id: device.id,
      name: device.name,
      brand: device.brand,
      state: device.state,
      creationTime: device.creationTime.toLocaleTimeString('en-US'),
    };
  }
}
