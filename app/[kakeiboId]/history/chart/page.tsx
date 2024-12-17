import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import HistoryByDayList from '@/components/history-by-day-list'
import prisma from '@/lib/prisma'

export async function fetchGroupedYearsAndMonths() {
  const result = await prisma.cashFlow.groupBy({
    by: ['timestamp'], // タイムスタンプを元にグループ化
    orderBy: {
      timestamp: 'desc',
    },
  })

  // グループ化したデータを整形
  const formatted = result.reduce((acc, entry) => {
    const date = new Date(entry.timestamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    // 既に存在するyearを探す
    let yearGroup = acc.find((group) => group.year === year)

    if (!yearGroup) {
      yearGroup = { year, months: [] }
      acc.push(yearGroup)
    }

    // 月がまだ追加されていない場合は追加
    if (!yearGroup.months.find((m) => m.month === month)) {
      yearGroup.months.push({ month })
    }

    return acc
  }, [] as { year: number; months: { month: number }[] }[])

  return formatted
}

export default async function HistoryChartPage() {
  const yearAndMonths = await fetchGroupedYearsAndMonths()

  return (
    <div className="px-3">
      <h1>Years and Months</h1>
      {yearAndMonths.map((date) => (
        <div className="" key={date.year}>
          <h2>year: {date.year}</h2>
          <Accordion type="single" collapsible>
            {date.months.map((month) => (
              <AccordionItem
                key={month.month}
                value={`${date.year}-${month.month}`}
              >
                <AccordionTrigger className="flex justify-between w-full">
                  <span>{`${month.month}月`}</span>
                  <span></span>
                </AccordionTrigger>
                <AccordionContent>
                  <HistoryByDayList year={date.year} month={month.month} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  )
}
