'use client';

import React, { useEffect, useState } from 'react'

import { PageViews, getPostHogPageViews } from '@/components/pages/protected/reporting/insights'
import PageTitle from '../../../../components/page-title'

const Page: React.FC = () => {
	const [chartData, setCount] = useState<any | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getPostHogPageViews();
			setCount(data.props.chartData);
		};

		fetchData();
	}, []);

	return (
		<>
			<PageTitle
				title={
					<>
						Customer Analytics
					</>
				}
			/>
			<PageViews chartData={chartData} />
		</>
	)
}

export default Page

