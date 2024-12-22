import prisma from '@/lib/prisma'
import { endOfMonth, startOfMonth } from 'date-fns'
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
    const dailyExpenses = await prisma.cashFlow.groupBy({
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

    return dailyExpenses.map((entry) => ({
      day: new Date(entry.timestamp).getDate(), // 日付部分を取得
      total: entry._sum.price || 0,
    }))
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
