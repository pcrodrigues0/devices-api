import { MigrationInterface, QueryRunner } from 'typeorm';

export class Devices1745795836362 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
         CREATE TABLE devices (
         id integer NOT NULL,
         name varchar(256) NOT NULL,
         brand varchar(256) NOT NULL,
         state varchar(50) NOT NULL DEFAULT 'INACTIVE',
         creation_time timestamp NOT NULL,
         constraint device_pk PRIMARY KEY (id)
         );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS devices;
        `);
  }
}
