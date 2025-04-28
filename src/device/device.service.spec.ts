import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DeviceDto, DeviceStateEnum, FindAllParameters } from './device.dto';
import { DeviceEntity } from '../db/entities/device.entity';

describe('DeviceService', () => {
  let service: DeviceService;
  let repository: Repository<DeviceEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        {
          provide: getRepositoryToken(DeviceEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DeviceService>(DeviceService);
    repository = module.get<Repository<DeviceEntity>>(
      getRepositoryToken(DeviceEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a device successfully', async () => {
      const deviceDto: DeviceDto = {
        id: 1,
        name: 'Device 1',
        brand: 'Brand A',
        state: DeviceStateEnum.AVAILABLE,
        creationTime: '2025-04-27 21:59:23.523',
      };

      const savedDevice: DeviceEntity = {
        id: 1,
        name: 'Device 1',
        brand: 'Brand A',
        state: DeviceStateEnum.AVAILABLE,
        creationTime: new Date(),
      };

      jest.spyOn(repository, 'save').mockResolvedValue(savedDevice);

      const result = await service.create(deviceDto);

      expect(repository.save).toHaveBeenCalledWith({
        id: deviceDto.id,
        name: deviceDto.name,
        brand: deviceDto.brand,
        state: deviceDto.state,
        creationTime: expect.any(Date),
      });

      expect(result).toEqual({
        id: savedDevice.id,
        name: savedDevice.name,
        brand: savedDevice.brand,
        state: savedDevice.state,
        creationTime: savedDevice.creationTime.toLocaleTimeString('en-US'),
      });
    });

    it('should throw an error if saving the device fails', async () => {
      const deviceDto: DeviceDto = {
        id: 1,
        name: 'Device 1',
        brand: 'Brand A',
        state: DeviceStateEnum.AVAILABLE,
        creationTime: '2025-04-27 21:59:23.523',
      };

      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.create(deviceDto)).rejects.toThrow('Database error');
    });
  });

  describe('update', () => {
    it('should throw an exception if the device does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const deviceDto: DeviceDto = {
        id: 1,
        name: 'Device 1',
        brand: 'Brand A',
        state: DeviceStateEnum.AVAILABLE,
        creationTime: '2025-04-27 21:59:23.523',
      };

      await expect(service.update(1, deviceDto)).rejects.toThrow(
        new HttpException(`Device with id 1 not found`, HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an exception if trying to update name or brand of a device in use', async () => {
      const inUseDevice = {
        id: 1,
        state: DeviceStateEnum.IN_USE,
      } as DeviceEntity;

      jest.spyOn(repository, 'findOne').mockResolvedValue(inUseDevice);

      const deviceDto: DeviceDto = {
        id: 1,
        name: 'Updated Name',
        brand: 'Updated Brand',
        state: DeviceStateEnum.IN_USE,
        creationTime: '2025-04-27 21:59:23.523',
      };

      await expect(service.update(1, deviceDto)).rejects.toThrow(
        new HttpException(
          `Cannot update name or brand of a device that is in use`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should allow state change from IN_USE to another state', async () => {
      const inUseDevice = {
        id: 1,
        state: DeviceStateEnum.IN_USE,
      } as DeviceEntity;

      jest.spyOn(repository, 'findOne').mockResolvedValue(inUseDevice);
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const deviceDto: DeviceDto = {
        id: 1,
        name: 'Updated Name',
        brand: 'Updated Brand',
        state: DeviceStateEnum.AVAILABLE,
        creationTime: '2025-04-27 21:59:23.523',
      };

      await expect(service.update(1, deviceDto)).resolves.toBeUndefined();
      expect(repository.update).toHaveBeenCalledWith(1, {
        name: 'Updated Name',
        brand: 'Updated Brand',
        state: DeviceStateEnum.AVAILABLE,
      });
    });

    it('should update name and brand if the device is not in use', async () => {
      const availableDevice = {
        id: 1,
        state: DeviceStateEnum.AVAILABLE,
      } as DeviceEntity;

      jest.spyOn(repository, 'findOne').mockResolvedValue(availableDevice);
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const deviceDto: DeviceDto = {
        id: 1,
        name: 'Updated Name',
        brand: 'Updated Brand',
        state: DeviceStateEnum.AVAILABLE,
        creationTime: '2025-04-27 21:59:23.523',
      };

      await expect(service.update(1, deviceDto)).resolves.toBeUndefined();
      expect(repository.update).toHaveBeenCalledWith(1, {
        name: 'Updated Name',
        brand: 'Updated Brand',
        state: DeviceStateEnum.AVAILABLE,
      });
    });
  });

  describe('findById', () => {
    it('should return a device if it exists', async () => {
      const deviceEntity: DeviceEntity = {
        id: 1,
        name: 'Device 1',
        brand: 'Brand A',
        state: DeviceStateEnum.AVAILABLE,
        creationTime: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(deviceEntity);

      const result = await service.findById(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({
        id: deviceEntity.id,
        name: deviceEntity.name,
        brand: deviceEntity.brand,
        state: deviceEntity.state,
        creationTime: deviceEntity.creationTime.toLocaleTimeString('en-US'),
      });
    });

    it('should throw an exception if the device does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(
        new HttpException(`Device with id 1 not found`, HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('findAll', () => {
    it('should return all devices matching the search parameters', async () => {
      const devices: DeviceEntity[] = [
        {
          id: 1,
          name: 'Device 1',
          brand: 'Brand A',
          state: DeviceStateEnum.AVAILABLE,
          creationTime: new Date(),
        },
        {
          id: 2,
          name: 'Device 2',
          brand: 'Brand B',
          state: DeviceStateEnum.IN_USE,
          creationTime: new Date(),
        },
      ];

      const params: FindAllParameters = {
        brand: 'Brand A',
        state: DeviceStateEnum.AVAILABLE,
      };

      jest.spyOn(repository, 'find').mockResolvedValue(devices);

      const result = await service.findAll(params);

      expect(repository.find).toHaveBeenCalledWith({
        where: {
          brand: params.brand,
          state: params.state,
        },
      });

      expect(result).toEqual(
        devices.map((device) => ({
          id: device.id,
          name: device.name,
          brand: device.brand,
          state: device.state,
          creationTime: device.creationTime.toLocaleTimeString('en-US'),
        })),
      );
    });

    it('should return all devices if no search parameters are provided', async () => {
      const devices: DeviceEntity[] = [
        {
          id: 1,
          name: 'Device 1',
          brand: 'Brand A',
          state: DeviceStateEnum.AVAILABLE,
          creationTime: new Date(),
        },
        {
          id: 2,
          name: 'Device 2',
          brand: 'Brand B',
          state: DeviceStateEnum.IN_USE,
          creationTime: new Date(),
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(devices);

      const result = await service.findAll({});

      expect(repository.find).toHaveBeenCalledWith({
        where: {},
      });

      expect(result).toEqual(
        devices.map((device) => ({
          id: device.id,
          name: device.name,
          brand: device.brand,
          state: device.state,
          creationTime: device.creationTime.toLocaleTimeString('en-US'),
        })),
      );
    });

    it('should return an empty array if no devices match the search parameters', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      const params: FindAllParameters = {
        brand: 'Nonexistent Brand',
        state: DeviceStateEnum.IN_USE,
      };

      const result = await service.findAll(params);

      expect(repository.find).toHaveBeenCalledWith({
        where: {
          brand: params.brand,
          state: params.state,
        },
      });

      expect(result).toEqual([]);
    });
  });

  describe('remove', () => {
    it('should throw an exception if the device does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(
        new HttpException(`Device with id 1 not found`, HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an exception if the device is in use', async () => {
      const inUseDevice = {
        id: 1,
        state: DeviceStateEnum.IN_USE,
      } as DeviceEntity;

      jest.spyOn(repository, 'findOne').mockResolvedValue(inUseDevice);

      await expect(service.remove(1)).rejects.toThrow(
        new HttpException(
          `Cannot delete a device that is currently in use`,
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should delete the device if it is not in use', async () => {
      const availableDevice = {
        id: 1,
        state: DeviceStateEnum.AVAILABLE,
      } as DeviceEntity;

      jest.spyOn(repository, 'findOne').mockResolvedValue(availableDevice);
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an exception if the deletion fails', async () => {
      const availableDevice = {
        id: 1,
        state: DeviceStateEnum.AVAILABLE,
      } as DeviceEntity;

      jest.spyOn(repository, 'findOne').mockResolvedValue(availableDevice);
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(1)).rejects.toThrow(
        new HttpException(
          `Failed to delete device with id 1`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
