import { z } from "zod";

import { ITUNES_API } from "../utils/constants.js";
import fastifyPlugin from "fastify-plugin";

export const podcastResultSchema = z.object({
  trackId: z.number(),
  collectionId: z.number(),
  artistName: z.string(),
  trackName: z.string(),
  collectionName: z.string(),
  trackViewUrl: z.string(),
});

export const iTunesSearchResponse = z.object({
  resultCount: z.number(),
  results: z.array(podcastResultSchema),
});

export class PodcastService {
  /**
   * Search for podcasts on iTunes.
   *
   * @param term The search term.
   * @param limit The number of results to return.
   * @param offset The offset to start from, useful for pagination.
   * @returns
   */
  async search(
    term: string,
    {
      limit,
      offset,
    }: {
      limit?: number;
      offset?: number;
    }
  ) {
    const response = await fetch(
      this.constructSearchEndpoint(term, limit, offset)
    );

    if (!response.ok) {
      throw new Error(await response.json());
    }

    const data = await response.json();
    return data as z.infer<typeof iTunesSearchResponse>;
  }

  constructSearchEndpoint(term: string, limit?: number, offset?: number) {
    let url = `${ITUNES_API.BASE_URL}?term=${encodeURIComponent(
      term
    )}&entity=podcast&media=podcast`;

    if (limit) {
      url += `&limit=${limit}`;
    }

    if (offset) {
      url += `&offset=${offset}`;
    }

    return url;
  }
}

const podcastService = fastifyPlugin(async (fastify, _) => {
  const service = new PodcastService();

  fastify.decorate("podcastService", service);
});

export default podcastService;
