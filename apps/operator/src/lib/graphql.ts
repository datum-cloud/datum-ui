import { SdkFunctionWrapper } from '../../../../codegen/src/schema';
import { GraphQLClient } from "graphql-request";


export interface Options<SDK> {
	url: string;
	headerProvider(): Record<string, string> | Promise<Record<string, string>>;
	sdk(client: GraphQLClient, wrapper: SdkFunctionWrapper): SDK;
}


export function createSdkClient<SDK>({ url, headerProvider, sdk }: Options<SDK>) {
	const client = new GraphQLClient(url
		, { credentials: 'include' }
	);

	return sdk(client, async action => {
		const headers = await headerProvider();
		client.setHeaders(headers);

		return action();
	});
}
