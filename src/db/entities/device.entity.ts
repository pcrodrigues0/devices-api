import { DeviceStateEnum } from 'src/device/device.dto';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'devices' })
export class DeviceEntity {
  @PrimaryColumn({ type: 'integer' })
  id: number;
  @Column({ type: 'varchar' })
  name: string;
  @Column({ type: 'varchar' })
  brand: string;
  @Column({
    type: 'enum',
    enum: DeviceStateEnum,
    default: DeviceStateEnum.INACTIVE,
  })
  state: DeviceStateEnum;
  @Column({ type: 'timestamptz', name: 'creation_time', update: false })
  creationTime: Date;
}
