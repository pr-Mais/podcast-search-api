import { PrismaClient } from "@prisma/client";
import { PodcastService } from "../services/itunes.service";
import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    podcastService: PodcastService;
  }
}
