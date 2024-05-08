import 'server-only'

export const token = process.env.DATUM_API_WRITE_TOKEN
if (!token) {
	throw new Error('Missing DATUM_API_WRITE_TOKEN')
}