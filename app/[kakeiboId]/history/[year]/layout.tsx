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
  }
}

export default async function Page({ children, params }: Props) {
  const { kakeiboId, year } = await params

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
        gte: startOfMonth(new Date(Date.UTC(Number(year) - 1))),
        lte: endOfMonth(new Date(Date.UTC(Number(year)))),
      },
      kakeiboId: kakeiboId,
    },
  })

  return (
    <>
      <Accordion type="single" collapsible className="w-full mt-3">
        <span className="bg-orange-500 w-full p-3">{year}</span>
        {children}
      </Accordion>
    </>
  )
}
