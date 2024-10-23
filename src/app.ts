import { FastifyInstance } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import search from "./routes/search.js";
import prismaPlugin from "./services/prisma.service.js";
import podcastService from "./services/itunes.service.js";

export default function (app: FastifyInstance) {
  // Register the Zod compiler plugins.
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Routes.
  app.register(search);

  // Plugins.
  app.register(prismaPlugin);
  app.register(podcastService);
}
