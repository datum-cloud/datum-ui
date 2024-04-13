'use client'

import { Card, Title, BarChart } from '@tremor/react';

export const PageViews = ({ chartData }: { chartData: any }) => {
	return (
		<>
			<Card>
				<Title>Page Views</Title>
				<BarChart
					className="mt-4 h-72"
					data={chartData}
					index="date"
					categories={['pageviews']}
					colors={['blue']}
				/>
			</Card>
		</>
	);
};


export async function getPostHogPageViews() {
	const trendsParams = new URLSearchParams();
	trendsParams.append(
		'events',
		JSON.stringify(
			[
				{
					id: '$pageview',
					math: 'dau'
				}
			]
		)
	);
	trendsParams.append('display', 'ActionsLineGraph');
	trendsParams.append('date_from', '-30d');
	trendsParams.append('properties', JSON.stringify(
		{
			type: "AND",
			values: [
				{
					type: "AND",
					values: [
						{
							key: "name",
							type: "group",
							operator: "exact",
							group_type_index: 0
						}
					]
				}
			]
		}
	));

	// this is the URL for the PostHog API with the docs project key
	const trendsUrl = `https://app.posthog.com/api/projects/${process.env.NEXT_PUBLIC_POSTHOG_PROJECT}/insights/trend?${trendsParams}`;

	const trendsRequest = await fetch(trendsUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.NEXT_PUBLIC_POSTHOG_PERSONAL_KEY}`
		}
	})
	const trendsResponse = await trendsRequest.json()

	const dataPoints = trendsResponse.result[0].data
	const labels = trendsResponse.result[0].labels

	const chartData = dataPoints.map((point: any, index: any) => {
		return {
			date: labels[index],
			pageviews: point
		}
	})

	return {
		props: {
			chartData
		}
	}
}

