import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = process.env.DATABASE_URL
  ? {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'taskmanagement',
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true,
    }
  : {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      database: 'taskmanagement',
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true,
    };
