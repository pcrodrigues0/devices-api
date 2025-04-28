import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/db/entities/device.entity';

@Module({
  controllers: [DeviceController],
  imports: [TypeOrmModule.forFeature([DeviceEntity])],
  providers: [DeviceService],
})
export class DeviceModule {}
