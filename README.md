# A simple Fastify Podcast Search API ✨

This project is a Fastify integration with the Apple iTunes Search API.

It includes a single endpoint that stores search results and returns a JSON response containing the results:

```json
{
  "resultCount": 12,
  "results": [
    {
      "trackId": 985515827,
      "collectionId": 985515827,
      "artistName": "ثمانية/ thmanyah",
      "trackName": "فنجان مع عبدالرحمن أبومالح",
      "collectionName": "فنجان مع عبدالرحمن أبومالح",
      "trackViewUrl": "https://podcasts.apple.com/us/podcast/..."
    }
  ]
}
```

It currently does not support pagination.

## Getting started locally

The project uses Fastify, Prisma (with PostgreSQL), and is strictly typed thanks to TypeScript. 

1. Get a PostgreSQL instance running locally using Docker Compose:

  ```bash
  docker compose up -d
  ```

2. Next, create the tables in your local DB:

  ```bash
  npx prisma migrate dev
  ```

3. Finally, run the server:
   
  ```bash
  npm run dev
  ```

## Search analytics

Search results are primarily stored for analytics, as the displayed results must always come directly from the iTunes API. Once podcast data is saved to the database, it becomes stale and won't reflect updates from Apple.

One of the questions the data model can answer is the following:
> How many times a podcast episode has appeared for users within their search results, and what terms were associated with it?

One key question the data model can answer is:

```bash
SELECT 
  track."trackId",
  track."trackName",
  COUNT(st."searchId") AS search_count,
  array_agg(DISTINCT search."searchTerm") AS search_terms
FROM 
  "SearchTrack" st
JOIN 
  "Track" track ON track.id = st."trackId"
JOIN
  "Search" search ON search.id = st."searchId"
GROUP BY 
  track."trackId", track."trackName"
ORDER BY 
  search_count DESC;
```

This can be answered with the following query:

```bash
  trackId   |                                             trackName                                              | search_count |            search_terms             
------------+----------------------------------------------------------------------------------------------------+--------------+-------------------------------------
 1028908750 | Hidden Brain                                                                                       |            7 | {hidden,"hidden brain",hiddenbrain}
 1569535757 | 5 minute podcast summaries of: Tim Ferriss, Hidden Brain, Sam Harris, Lex Fridman, Jordan Peterson |            7 | {hidden,"hidden brain",hiddenbrain}
 1586880312 | My Unsung Hero                                                                                     |            7 | {hidden,"hidden brain",hiddenbrain}
 1643214421 | The Hidden Healing of Emotions -The Heroine's Journey                                              |            5 | {"hidden brain",hiddenbrain}
  432817388 | The Hidden Institute                                                                               |            2 | {hidden}
  666596114 | The Hidden History of Los Angeles                                                                  |            2 | {hidden}
```