import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";

import fastifyPlugin from "fastify-plugin";

// Register a Prisma client to use through the fastify instance.
const prismaPlugin = fastifyPlugin(async (fastify, _) => {
  const prisma = new PrismaClient();

  await prisma.$connect();

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (_: FastifyInstance) => {
    await prisma.$disconnect();
  });
});

export default prismaPlugin;
