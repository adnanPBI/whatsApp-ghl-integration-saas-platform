import "dotenv/config";
import { DataSource } from "typeorm";

const nodeEnv = (process.env.NODE_ENV ?? "development").toLowerCase();
const isProd = nodeEnv === "production";

// Prefer Vercel env naming (but keep backward compatibility)
const sslFlag = process.env.DB_SSL ?? process.env.DATABASE_SSL ?? "false";
const sslEnabled = sslFlag === "true";

const poolMaxRaw = process.env.DB_POOL_MAX ?? (isProd ? "1" : "5");
const poolMax = Number.isFinite(parseInt(poolMaxRaw, 10)) ? parseInt(poolMaxRaw, 10) : 1;

// Prefer DATABASE_URL if provided
const databaseUrl = process.env.DATABASE_URL;

export default new DataSource({
  type: "postgres",

  ...(databaseUrl
    ? { url: databaseUrl }
    : {
        host: process.env.DATABASE_HOST || "localhost",
        port: parseInt(process.env.DATABASE_PORT || "5432", 10),
        username: process.env.DATABASE_USERNAME || "whatsapp_ghl",
        password: process.env.DATABASE_PASSWORD || "password",
        database: process.env.DATABASE_NAME || "whatsapp_ghl_db",
      }),

  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../database/migrations/**/*{.ts,.js}"],

  synchronize: false,

  ssl: sslEnabled ? { rejectUnauthorized: false } : false,

  extra: {
    max: poolMax,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
});
