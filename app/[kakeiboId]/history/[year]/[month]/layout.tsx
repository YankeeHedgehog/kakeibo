import prisma from '@/lib/prisma'
import { endOfMonth, startOfMonth } from 'date-fns'
import { ReactNode } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type Props = {
  children: ReactNode
  params: {
    kakeiboId: string
    year: string
    month: string
  }
}

export default async function Page({ children, params }: Props) {
  const { kakeiboId, year, month } = await params

  // 毎月のカテゴリーごとの合計
  const histories = await prisma.cashFlow.groupBy({
    by: ['categoryId'],
    _sum: {
      price: true,
    },
    _count: {
      id: true,
    },
    where: {
      timestamp: {
        gte: startOfMonth(new Date(Date.UTC(Number(year), Number(month) - 1))),
        lte: endOfMonth(new Date(Date.UTC(Number(year), Number(month)))),
      },
      kakeiboId: kakeiboId,
    },
  })

  return (
    <AccordionItem value={month}>
      <AccordionTrigger>{month}</AccordionTrigger>
      <AccordionContent>
        {histories.map((history) => (
          <p>{Number(history._sum.price)}</p>
        ))}
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}
