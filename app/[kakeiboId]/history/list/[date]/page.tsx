import Icon from '@/components/icon'
import prisma from '@/lib/prisma'
import { endOfDay, startOfDay } from 'date-fns'
import dynamicIconImports from 'lucide-react/dynamicIconImports'

type Props = {
  params: {
    kakeiboId: string
    date: string
  }
}

export default async function ItemsPage({ params }: Props) {
  const { kakeiboId, date } = await params

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

  const cashsSum = cashs.reduce(
    (sum, element) => sum + Number(element.price),
    0
  )

  return (
    <>
      <p className="flex justify-between w-auto bg-primary text-primary-foreground px-3 py-3">
        <span>{`${year}/${month}/${day}`}</span>
        <span>{cashsSum}円</span>
      </p>
      <div>
        {cashs.map((cash) => (
          <div
            key={cash.id}
            className="m-1 px-2 py-1 w-auto border-dotted border-2 border-primary rounded-md"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Icon
                  name={cash.category?.icon as keyof typeof dynamicIconImports}
                />
                {cash.category?.name}
              </div>
              {`${cash.price.toString()}円`}
            </div>
            <span>メモ: {cash.memo}</span>
          </div>
        ))}
      </div>
    </>
  )
}
