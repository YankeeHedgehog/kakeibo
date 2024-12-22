import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import prisma from '@/lib/prisma'
import { endOfDay, startOfDay } from 'date-fns'

type Props = {
  params: {
    kakeiboId: string
    date: string
  }
}

export default async function ItemsPage({ params }: Props) {
  const { kakeiboId, date } = params

  const newDate = new Date(date)

  const year = newDate.getUTCFullYear()
  const month = newDate.getUTCMonth() + 1
  const day = newDate.getUTCDate()

  const cashs = await prisma.cashFlow.findMany({
    where: {
      kakeiboId: kakeiboId,
      timestamp: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
    },
    include: {
      category: true,
    },
  })

  return (
    <>
      <p className="bg-yellow-500 px-3 py-2 text-white">{year}</p>
      <Accordion type="single" collapsible>
        <AccordionItem value={`1`}>
          <AccordionTrigger className="bg-orange-500 px-3 py-4 text-white flex justify-between">
            <span>{`${month}/1 ~ ${month}/31`}</span>
            <span className="ml-auto mr-3">
              {cashs.reduce((sum, item) => sum + item.price.toNumber(), 0)}円
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {`${year}/${month}/${day}`}
            {cashs.map((cash) => (
              <div key={cash.id}>
                <span>
                  {cash.price.toString()}
                  <br />
                  {cash.category?.name}
                  <br />
                </span>
                <span>
                  {cash.timestamp.toString()}
                  <br />
                </span>
                <span>
                  {cash.memo}
                  <br />
                </span>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
