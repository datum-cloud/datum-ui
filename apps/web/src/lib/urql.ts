import { Client, cacheExchange, fetchExchange } from 'urql'
import { gqlUrl } from '@repo/dally/auth'
import { token } from './token



export const createClient = () => new Client({
	url: gqlUrl,
	// - cacheExchange: implements the default "document caching" behavior
	// - fetchExchange: send our requests to the GraphQL API
	exchanges: [cacheExchange, fetchExchange],
	fetchOptions: () => {
		return {
			headers: { authorization: token ? `Bearer ${token}` : '' },
			credentials: 'include'
		};
	},
});
