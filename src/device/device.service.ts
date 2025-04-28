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

  async update(id: number, device: DeviceDto) {
    const foundDevice = await this.deviceRepository.findOne({
      where: { id: id },
    });
    if (!foundDevice) {
      throw new HttpException(
        `Device with id ${device.id} not found`,
        HttpStatus.BAD_REQUEST,
      );
    }
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
    const result = await this.deviceRepository.delete({ id: id });
    if (!result) {
      throw new HttpException(
        `Device with id ${id} not found`,
        HttpStatus.BAD_REQUEST,
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

  private mapDtoToEntity(deviceDto: DeviceDto): Partial<DeviceEntity> {
    return {
      brand: deviceDto.brand,
      name: deviceDto.name,
      state: deviceDto.state,
    };
  }
}
