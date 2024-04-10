'use client';

import React, { useState } from 'react'
import {
	JsonFormsStyleContext,
	vanillaCells,
	vanillaRenderers
} from "@jsonforms/vanilla-renderers";
import { JsonForms } from "@jsonforms/react";
import { createSdkClient } from '../../../../lib/graphql'
import { getSdkWithHooks } from '../../../../../../../codegen/src/schema';
import { useSession } from "next-auth/react";
import { restUrl } from '@repo/dally/auth'

const url = restUrl || 'http://localhost:17608/query';

const styleContextValue = {
	styles: [
		{
			name: "control",
			classNames: "my-5"
		},
		{
			name: "control.input",
			classNames:
				"Input"
		},
		{
			name: "control.select",
			classNames:
				"w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out appearance-none"
		},
		{
			name: "control.label",
			classNames:
				"block uppercase tracking-wide text-gray-700 text-xs font-bold pb-4"
		},
		{
			name: "array.button",
			classNames: "Button"
		},
		{
			name: "control.validation",
			classNames: "text-red-500 font-normal mt-2 text-xs"
		},
		{
			name: "vertical.layout",
			classNames:
				"block uppercase tracking-wide text-gray-700 text-s font-bold mb-2"
		},
		{
			name: "group.layout",
			classNames: "accordion-item bg-white"
		},
		{
			name: "group.label",
			classNames:
				"accordion-button relative flex w-full py-4 transition focus:outline-none block uppercase tracking-wide text-gray-700 text-s font-bold pb-4"
		}
	]
};

const renderers = [
	...vanillaRenderers,
];


const headerProvider = (token?: string) => {
	return {
		"Content-Type": "application/json;charset=UTF-8",
		accept: "application/json",
		authorization: `Bearer ${token}`,
	};
};




const Page: React.FC = () => {
	const { data: session } = useSession();

	const client = createSdkClient({
		url,
		headerProvider: () => headerProvider(session?.user?.accessToken!),
		sdk: getSdkWithHooks
	});

	// TODO: start with data from the template
	const [data, setData] = useState({});

	const variables = { getTemplateId: "01HV33T07DQ88N4SA97T25Q6EB" }
	const { data: templateData, error } = client.useGetTemplate('GetTemplate', variables);

	if (error) return <div>failed to load</div>
	if (!templateData) return <div>loading...</div>

	console.log(templateData.template.id)

	return (
		< div >
			<JsonFormsStyleContext.Provider value={styleContextValue}>
				<JsonForms
					schema={templateData.template.jsonconfig}
					data={data}
					renderers={renderers}
					cells={vanillaCells}
					onChange={({ data }) => setData(data)}
				/>
			</JsonFormsStyleContext.Provider>
		</div >
	)

}

export default Page
