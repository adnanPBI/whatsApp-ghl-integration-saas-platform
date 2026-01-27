import "reflect-metadata";
import express from "express";
import { ExpressAdapter } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";

let cachedServer: ReturnType<typeof express> | null = null;

async function bootstrap() {
  const server = express();

  // Nest build output is dist/src/*
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("../dist/src/app.module");
  const AppModule = mod.AppModule;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ["error", "warn", "log"],
  });

  // keep consistent with your API prefix
  app.setGlobalPrefix("api");

  await app.init();
  return server;
}

export default async function handler(req: any, res: any) {
  if (!cachedServer) cachedServer = await bootstrap();
  return cachedServer(req, res);
}
