import prisma from '@/lib/prisma'
import { endOfMonth, format, startOfMonth } from 'date-fns'
import Link from 'next/link'

export default async function HistoryByDayList({
  year,
  month,
}: {
  year: number
  month: number
}) {
  const fetchDailyExpenses = async (year: number, month: number) => {
    'use server'
    const startDate = startOfMonth(
      new Date(Date.UTC(Number(year), Number(month) - 1))
    ) // 月初日
    const endDate = endOfMonth(new Date(Date.UTC(Number(year), Number(month)))) // 翌月の月初日

    // Prisma groupByクエリで日ごとの支出を集計
    const expenses = await prisma.cashFlow.groupBy({
      by: ['timestamp'], // タイムスタンプごとにグループ化
      _sum: { price: true },
      where: {
        timestamp: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: { timestamp: 'asc' },
    })

    // 日付ごとに集計
    const dailyTotals = expenses.reduce((acc, curr) => {
      const date = new Date(curr.timestamp)
      const dayKey = format(date, 'yyyy-MM-dd')

      if (!acc[dayKey]) {
        acc[dayKey] = {
          day: date.getDate(),
          total: 0,
          dateString: dayKey,
        }
      }

      acc[dayKey].total += curr._sum.price?.toNumber() || 0
      return acc
    }, {} as Record<string, { day: number; total: number; dateString: string }>)

    // オブジェクトを配列に変換し、日付でソート
    return Object.values(dailyTotals).sort((a, b) => a.day - b.day)
  }

  const dailyExpenses = await fetchDailyExpenses(Number(year), Number(month))

  return (
    <>
      {dailyExpenses.map((dailyExpenses) => (
        <Link
          href={`list/${year}-${month}-${dailyExpenses.day
            .toString()
            .padStart(2, '0')}`}
          key={dailyExpenses.day}
          className="flex justify-between w-full"
        >
          <span>{`${month}月${dailyExpenses.day}日`}</span>
          <span> {`${dailyExpenses.total.toString()}円`}</span>
        </Link>
      ))}
    </>
  )
}
