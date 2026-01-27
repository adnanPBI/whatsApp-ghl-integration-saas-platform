"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const platform_express_1 = require("@nestjs/platform-express");
const core_1 = require("@nestjs/core");
let cachedServer = null;
async function loadAppModule() {
    try {
        const mod = require("../dist/app.module");
        return mod.AppModule;
    }
    catch (_e) {
        const mod = require("../src/app.module");
        return mod.AppModule;
    }
}
async function bootstrap() {
    const server = (0, express_1.default)();
    const AppModule = await loadAppModule();
    const app = await core_1.NestFactory.create(AppModule, new platform_express_1.ExpressAdapter(server), {
        logger: ["error", "warn", "log"],
    });
    app.setGlobalPrefix("api");
    await app.init();
    return server;
}
async function handler(req, res) {
    if (!cachedServer)
        cachedServer = await bootstrap();
    return cachedServer(req, res);
}
//# sourceMappingURL=index.js.map