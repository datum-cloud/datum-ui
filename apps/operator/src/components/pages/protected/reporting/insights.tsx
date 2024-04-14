'use client'

import { Card, Title, BarChart, AreaChart, Text } from '@tremor/react';
import { BarList } from '@/components/BarList'

const data2 = [
  { name: "/home", value: 843 },
  { name: "/imprint", value: 46 },
  { name: "/cancellation", value: 3 },
  { name: "/blocks", value: 108 },
  { name: "/documentation", value: 384 },
]

export const BarListExample = () => {
  return <BarList data={data2} />
}


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

const data = [
  {
    Month: 'Jan 21',
    Sales: 2890,
    Profit: 2400
  },
  {
    Month: 'Feb 21',
    Sales: 1890,
    Profit: 1398
  },
  {
    Month: 'Jan 22',
    Sales: 3890,
    Profit: 2980
  }
];

export default function Chart() {
  return (
    <Card className="mt-8">
      <Title>Performance</Title>
      <Text>Comparison between Sales and Profit</Text>
      <AreaChart
        className="mt-4 h-80"
        data={data}
        categories={['Sales', 'Profit']}
        index="Month"
        colors={['indigo', 'fuchsia']}
        valueFormatter={(number: number) =>
          `$ ${Intl.NumberFormat('us').format(number).toString()}`
        }
        yAxisWidth={60}
      />
    </Card>
  );
}

