import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'hiphopneverdie',
  password: 'hiphopneverdie',
  database: 'hiphopneverdie',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
