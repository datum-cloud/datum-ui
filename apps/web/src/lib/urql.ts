import { Client, cacheExchange, fetchExchange } from 'urql'
import { gqlUrl } from '@repo/dally/auth'

const token = process.env.DATUM_API_WRITE_TOKEN
if (!token) {
	throw new Error('Missing DATUM_API_WRITE_TOKEN')
}

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
