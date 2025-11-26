import 'dotenv/config';
import { DataSource } from 'typeorm';

const isSslEnabled = process.env.DATABASE_SSL === 'true';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USERNAME || 'whatsapp_ghl',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'whatsapp_ghl_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
  synchronize: false,
  ssl: isSslEnabled
    ? {
        rejectUnauthorized: false,
      }
    : false,
});
