import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'devices' })
export class DeviceEntity {
  @PrimaryColumn({ type: 'integer' })
  id: number;
  @Column({ type: 'varchar' })
  name: string;
  @Column({ type: 'varchar' })
  brand: string;
  @Column({ type: 'varchar' })
  state: string;
  @Column({ type: 'integer', name: 'creation_time', update: false })
  creationTime: number;
}
