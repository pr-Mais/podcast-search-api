import { z } from "zod";
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { ROUTES } from "../utils/constants.js";
import {
  ErrorCodes,
  ErrorMessages,
  ErrorSchema,
} from "../schemas/error.schema.js";
import { iTunesSearchResponse } from "../services/itunes.service.js";

const SearchQuerySchema = z.object({
  term: z.string().optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

const SearchResponse = iTunesSearchResponse;

export default async function search(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    ROUTES.SEARCH,
    {
      preValidation: preValidation,
      schema: {
        querystring: SearchQuerySchema,
        response: {
          200: SearchResponse,
          400: ErrorSchema,
          500: ErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { term, limit, offset } = request.query;

      if (!term) {
        return reply.status(400).send({
          message: ErrorMessages.MISSING_TERM,
          code: ErrorCodes.MISSING_TERM,
        });
      }

      try {
        const data = await fastify.podcastService.search(term, {
          limit: limit,
          offset: offset,
        });

        await saveResult(term, data);

        return data;
      } catch (error: any) {
        fastify.log.error(error);
        return reply.status(500).send({
          message: error.message,
        });
      }
    }
  );

  async function saveResult(
    term: string,
    data: z.infer<typeof iTunesSearchResponse>
  ) {
    return fastify.prisma.search.create({
      data: {
        searchTerm: term,
        searchTracks: {
          create: data.results.map((podcast: any) => ({
            track: {
              create: {
                trackId: podcast.trackId,
                collectionId: podcast.collectionId,
                trackName: podcast.trackName,
                collectionName: podcast.collectionName,
                trackViewUrl: podcast.trackViewUrl,
              },
            },
          })),
        },
      },
      include: {
        searchTracks: { include: { track: true } },
      },
    });
  }

  async function preValidation(
    request: FastifyRequest,
    _: FastifyReply,
    done: HookHandlerDoneFunction
  ) {
    const query = request.query as any;
    // Parse `limit` and `offset` as integers before schema validation.
    if (query.limit) {
      query.limit = parseInt(query.limit, 10);
    }
    if (query.offset) {
      query.offset = parseInt(query.offset, 10);
    }
    done();
  }
}
