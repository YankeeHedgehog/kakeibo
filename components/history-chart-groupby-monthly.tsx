'use client'

import { Cell, Pie, PieChart } from 'recharts'

export type HistoryChartDataType = {
  icon: string
  name: string
  value: number
}

const initialData: HistoryChartDataType[] = [
  { icon: '', name: 'Group A', value: 400 },
  { icon: '', name: 'Group B', value: 300 },
  { icon: '', name: 'Group C', value: 300 },
  { icon: '', name: 'Group D', value: 200 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  payload,
}: {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: number
  payload: HistoryChartDataType
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${payload.name} ${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function HistoryChartGroupbyMonthly({
  data = initialData,
}: {
  data?: HistoryChartDataType[]
}) {
  const demoUrl =
    'https://codesandbox.io/s/pie-chart-with-customized-label-dlhhj'

  return (
    <PieChart width={200} height={200}>
      <Pie
        data={data}
        cx={100}
        cy={100}
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  )
}
