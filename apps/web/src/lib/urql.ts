import { Client, cacheExchange, fetchExchange } from 'urql'

export const createClient = () =>
  new Client({
    url: '/api/graphql',
    // - cacheExchange: implements the default "document caching" behavior
    // - fetchExchange: send our requests to the GraphQL API
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  })
