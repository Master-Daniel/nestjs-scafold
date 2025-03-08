import { defineConfig } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { MySqlDriver } from '@mikro-orm/mysql';
import { ConfigService } from '@nestjs/config';
import { Migrator } from '@mikro-orm/migrations';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { SeedManager } from '@mikro-orm/seeder';

const configService = new ConfigService();

export default defineConfig({
  driver: MySqlDriver,
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  user: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASSWORD'),
  dbName: configService.get<string>('DB_NAME'),
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator, EntityGenerator, SeedManager],
  debug: true,
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  migrations: {
    path: 'src/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: false,
    emit: 'ts',
  },
});
