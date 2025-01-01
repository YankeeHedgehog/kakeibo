import prisma from '@/lib/prisma'
import { endOfMonth, startOfMonth } from 'date-fns'
import HistoryChartGroupbyMonthly, {
  HistoryChartDataType,
} from './history-chart-groupby-monthly'
import Icon from './icon'
import dynamicIconImports from 'lucide-react/dynamicIconImports'

type Props = {
  kakeiboId: string
  year: number
  month: number
}

export default async function HistoryChartByCategory({
  kakeiboId,
  year,
  month,
}: Props) {
  const fetchCategoryExpenses = async (
    year: number,
    month: number,
    kakeiboId: string
  ) => {
    'use server'
    const startDate = startOfMonth(
      new Date(Date.UTC(Number(year), Number(month) - 1))
    )
    const endDate = endOfMonth(new Date(Date.UTC(Number(year), Number(month))))

    const categories = await prisma.cashFlow.groupBy({
      by: ['categoryId'],
      _sum: {
        price: true,
      },
      _count: {
        id: true,
      },
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
        kakeiboId: kakeiboId,
        categoryId: {
          not: null,
        },
      },
    })

    // Fetch category details for all categoryIds
    const categoryDetails = await prisma.category.findMany({
      where: {
        id: {
          in: categories.map((cat) => cat.categoryId as string),
        },
        kakeiboId: kakeiboId,
      },
    })

    // Combine the expenses with category details
    const categoriesWithDetails = categories.map((categoryExpense) => ({
      ...categoryExpense,
      icon:
        categoryDetails.find((cat) => cat.id === categoryExpense.categoryId)
          ?.icon || 'Unknown',
      name:
        categoryDetails.find((cat) => cat.id === categoryExpense.categoryId)
          ?.name || 'Unknown',
    }))

    return categoriesWithDetails
  }

  const categoryExpenses = await fetchCategoryExpenses(year, month, kakeiboId)
  const data: HistoryChartDataType[] = categoryExpenses.map(
    (categoryExpense) => {
      return {
        icon: categoryExpense.icon,
        name: categoryExpense.name,
        value: Number(categoryExpense._sum.price),
      }
    }
  )

  const priceSum = data.reduce((sum, element) => sum + element.value, 0)

  return (
    <>
      <HistoryChartGroupbyMonthly data={data} />
      {data.map((d) => (
        <div key={d.name} className="flex justify-between items-center">
          <div className="flex justify-start items-center gap-1">
            <Icon name={d.icon as keyof typeof dynamicIconImports} />
            {d.name}
          </div>
          <div>
            {`${((d.value / priceSum) * 100).toFixed(0)}%`}
            {d.value.toString().padStart(10)}円
          </div>
        </div>
      ))}
    </>
  )
}
