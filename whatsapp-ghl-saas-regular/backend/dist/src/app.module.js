"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const schedule_1 = require("@nestjs/schedule");
const auth_module_1 = require("./modules/auth/auth.module");
const tenant_module_1 = require("./modules/tenant/tenant.module");
const ghl_module_1 = require("./modules/ghl/ghl.module");
const whatsapp_module_1 = require("./modules/whatsapp/whatsapp.module");
const webhook_module_1 = require("./modules/webhook/webhook.module");
const message_module_1 = require("./modules/message/message.module");
const contact_module_1 = require("./modules/contact/contact.module");
const billing_module_1 = require("./modules/billing/billing.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const database_module_1 = require("./database/database.module");
const encryption_module_1 = require("./common/encryption/encryption.module");
const logger_module_1 = require("./common/logger/logger.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            database_module_1.DatabaseModule,
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    redis: {
                        host: configService.get('REDIS_HOST'),
                        port: configService.get('REDIS_PORT'),
                        password: configService.get('REDIS_PASSWORD'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            schedule_1.ScheduleModule.forRoot(),
            auth_module_1.AuthModule,
            tenant_module_1.TenantModule,
            ghl_module_1.GhlModule,
            whatsapp_module_1.WhatsappModule,
            webhook_module_1.WebhookModule,
            message_module_1.MessageModule,
            contact_module_1.ContactModule,
            billing_module_1.BillingModule,
            analytics_module_1.AnalyticsModule,
            encryption_module_1.EncryptionModule,
            logger_module_1.LoggerModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map