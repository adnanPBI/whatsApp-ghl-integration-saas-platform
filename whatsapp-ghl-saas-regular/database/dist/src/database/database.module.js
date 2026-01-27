"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const nodeEnv = (config.get("NODE_ENV") ?? "development").toLowerCase();
                    const isProd = nodeEnv === "production";
                    const databaseUrl = config.get("DATABASE_URL");
                    const sslFlag = config.get("DB_SSL") ??
                        config.get("DATABASE_SSL") ??
                        "false";
                    const sslEnabled = sslFlag === "true";
                    const poolMaxRaw = config.get("DB_POOL_MAX") ?? (isProd ? "1" : "5");
                    const poolMax = Number.isFinite(parseInt(poolMaxRaw, 10)) ? parseInt(poolMaxRaw, 10) : 1;
                    const host = config.get("DATABASE_HOST");
                    const portRaw = config.get("DATABASE_PORT") ?? "5432";
                    const port = parseInt(portRaw, 10);
                    const username = config.get("DATABASE_USERNAME");
                    const password = config.get("DATABASE_PASSWORD");
                    const database = config.get("DATABASE_NAME");
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
                        synchronize: false,
                        migrationsRun: false,
                        logging: !isProd,
                        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
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
], DatabaseModule);
//# sourceMappingURL=database.module.js.map