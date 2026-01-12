import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const nodeEnv = (config.get<string>("NODE_ENV") ?? "development").toLowerCase();
        const isProd = nodeEnv === "production";

        // Prefer DATABASE_URL (what you configured on Vercel)
        const databaseUrl = config.get<string>("DATABASE_URL");

        // Support both DB_SSL and DATABASE_SSL (backward compatible)
        const sslFlag =
          config.get<string>("DB_SSL") ??
          config.get<string>("DATABASE_SSL") ??
          "false";
        const sslEnabled = sslFlag === "true";

        // Pool max: default 1 in prod, 5 in dev (override via DB_POOL_MAX)
        const poolMaxRaw = config.get<string>("DB_POOL_MAX") ?? (isProd ? "1" : "5");
        const poolMax = Number.isFinite(parseInt(poolMaxRaw, 10)) ? parseInt(poolMaxRaw, 10) : 1;

        // Fallback to split env vars if DATABASE_URL isn't provided
        const host = config.get<string>("DATABASE_HOST");
        const portRaw = config.get<string>("DATABASE_PORT") ?? "5432";
        const port = parseInt(portRaw, 10);
        const username = config.get<string>("DATABASE_USERNAME");
        const password = config.get<string>("DATABASE_PASSWORD");
        const database = config.get<string>("DATABASE_NAME");

        return {
          type: "postgres",

          ...(databaseUrl
            ? { url: databaseUrl }
            : {
                host,
                port,
                username,
                password,
                database,
              }),

          entities: [__dirname + "/../**/*.entity{.ts,.js}"],

          // NEVER auto-sync schema in production
          synchronize: false,

          // IMPORTANT: do not run migrations at cold start (serverless)
          migrationsRun: false,

          // Keep logs only in dev
          logging: !isProd,

          // SSL for most hosted postgres
          ssl: sslEnabled ? { rejectUnauthorized: false } : false,

          // Serverless-safe pooling
          extra: {
            max: poolMax,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
