import { OpenFgaClient } from "@openfga/sdk";


export type FGACheckTuple = {
	user: string,
	object: string,
	relation: string
}

export type FGAListTuple = {
	user: string,
	relation: string,
	type: string
}

export function newFgaClient(fgaUrl: string, fgaStoreId: string, fgaAuthorizationModelId: string) {
	return new OpenFgaClient({
		apiUrl: fgaUrl,
		storeId: fgaStoreId,
		authorizationModelId: fgaAuthorizationModelId,
		// TODO: add credentials setup
		// credentials: {
		// 	method: CredentialsMethod.ClientCredentials,
		// 	config: {
		// 		apiTokenIssuer: process.env.FGA_API_TOKEN_ISSUER as string,
		// 		apiAudience: process.env.FGA_API_AUDIENCE as string,
		// 		clientId: process.env.FGA_CLIENT_ID as string,
		// 		clientSecret: process.env.FGA_CLIENT_SECRET as string,
		// 	},
		// },
	});
}


export async function checkTuple(client: OpenFgaClient, payload: FGACheckTuple) {
	const { user, object, relation } = payload;

	const result = await client.check({
		user,
		relation,
		object,
	});

	return result;
}

export async function listAllTuples(client: OpenFgaClient, payload: FGAListTuple) {
	const { user, relation, type } = payload;

	const result = await client.listObjects({
		user,
		relation,
		type,
	});

	return result;
}

