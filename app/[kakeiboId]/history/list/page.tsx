import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import HistoryByDayList from '@/components/history-list-by-day'
import prisma from '@/lib/prisma'

async function fetchGroupedYearsAndMonths() {
  const result = await prisma.cashFlow.groupBy({
    by: ['timestamp'], // タイムスタンプを元にグループ化
    orderBy: {
      timestamp: 'desc',
    },
    _sum: {
      price: true,
    },
  })

  // グループ化したデータを整形
  const formatted = result.reduce((acc, entry) => {
    const date = new Date(entry.timestamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const price = Number(entry._sum.price) || 0

    // 既に存在するyearを探す
    let yearGroup = acc.find((group) => group.year === year)

    if (!yearGroup) {
      yearGroup = { year, months: [] }
      acc.push(yearGroup)
    }

    // 月がまだ追加されていない場合は追加
    const existingMonth = yearGroup.months.find((m) => m.month === month)
    if (!existingMonth) {
      yearGroup.months.push({ month, price })
    } else {
      existingMonth.price += price
    }

    return acc
  }, [] as { year: number; months: { month: number; price: number }[] }[])

  return formatted
}

type Props = {
  params: Promise<{ kakeiboId: string }>
}

export default async function HistoryListPage({ params }: Props) {
  const { kakeiboId } = await params
  const currentDay = new Date()
  const yearAndMonths = await fetchGroupedYearsAndMonths()

  return (
    <div>
      {yearAndMonths.map((date) => (
        <div key={date.year}>
          <h2 className="w-auto bg-primary text-primary-foreground px-3 py-3">
            {date.year}年
          </h2>
          <Accordion
            type="single"
            collapsible
            defaultValue={`${currentDay.getFullYear()}-${
              currentDay.getUTCMonth() + 1
            }`}
          >
            {date.months.map((month) => (
              <AccordionItem
                key={month.month}
                value={`${date.year}-${month.month}`}
                className="bg-secondary text-primary-foreground px-3 py-3"
              >
                <AccordionTrigger className="flex justify-between w-full">
                  <span>{`${month.month}月`}</span>
                  <span className="ml-auto mr-2">{`${month.price}円`}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <HistoryByDayList
                    year={date.year}
                    month={month.month}
                    kakeiboId={kakeiboId}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  )
}
