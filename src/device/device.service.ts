import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  DeviceDto,
  DeviceStateEnum,
  DeviceUpdateDto,
  FindAllParameters,
} from './device.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DeviceEntity } from '../db/entities/device.entity';

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

  async update(id: number, device: DeviceUpdateDto) {
    const foundDevice = await this.deviceRepository.findOne({
      where: { id: id },
    });
    if (!foundDevice) {
      throw new HttpException(
        `Device with id ${id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
    // Prevent updates to name and brand if the device is in use
    // This can be refactored to simplify
    const newState = device.state ? device.state : foundDevice.state;
    if (
      foundDevice.state === DeviceStateEnum.IN_USE &&
      (device.name || device.brand) &&
      foundDevice.state === DeviceStateEnum.IN_USE &&
      newState === DeviceStateEnum.IN_USE
    ) {
      throw new HttpException(
        `Cannot update name or brand of a device that is in use`,
        HttpStatus.BAD_REQUEST,
      );
    }
    // Allow state change if transitioning from "IN_USE" to another state
    await this.deviceRepository.update(id, this.mapDtoToEntity(device));
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

  async remove(id: number) {
    const foundDevice = await this.deviceRepository.findOne({
      where: { id: id },
    });

    if (!foundDevice) {
      throw new HttpException(
        `Device with id ${id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Prevent deletion if the device is in use
    if (foundDevice.state === DeviceStateEnum.IN_USE) {
      throw new HttpException(
        `Cannot delete a device that is currently in use`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.deviceRepository.delete({ id: id });
    if (result.affected === 0) {
      throw new HttpException(
        `Failed to delete device with id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private mapEntityToDto(deviceEntity: DeviceEntity): DeviceDto {
    return {
      id: deviceEntity.id,
      name: deviceEntity.name,
      brand: deviceEntity.brand,
      state: deviceEntity.state,
      creationTime: deviceEntity.creationTime.toLocaleTimeString('en-US'),
    };
  }

  private mapDtoToEntity(deviceDto: DeviceUpdateDto): Partial<DeviceEntity> {
    return {
      brand: deviceDto.brand,
      name: deviceDto.name,
      state: deviceDto.state,
    };
  }
}
