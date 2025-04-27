import { Column, Entity } from 'typeorm';

@Entity({ name: 'device' })
export class deviceEntity {
  @Column({ type: 'integer' })
  id: number;
  @Column({ type: 'varchar' })
  name: string;
  @Column({ type: 'integer' })
  brand: string;
  @Column({ type: 'varchar' })
  state: string;
  @Column({ type: 'integer', name: 'creation_time' })
  creationTime: number;
}
