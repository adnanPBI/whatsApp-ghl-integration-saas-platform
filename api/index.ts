import "reflect-metadata";

import express from "express";
import { ExpressAdapter } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";

let cachedServer: ReturnType<typeof express> | null = null;

async function loadAppModule() {
  try {
    // Prefer compiled build if present
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("../whatsapp-ghl-saas-regular/backend/dist/app.module");
    return mod.AppModule;
  } catch (_e) {
    // Fallback to TS source
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("../whatsapp-ghl-saas-regular/backend/src/app.module");
    return mod.AppModule;
  }
}

async function bootstrap() {
  const server = express();
  const AppModule = await loadAppModule();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ["error", "warn", "log"],
  });

  await app.init();
  return server;
}

export default async function handler(req: any, res: any) {
  if (!cachedServer) cachedServer = await bootstrap();
  return cachedServer(req, res);
}
