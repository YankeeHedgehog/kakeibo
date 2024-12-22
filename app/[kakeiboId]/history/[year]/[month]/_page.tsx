import prisma from '@/lib/prisma'
import { endOfMonth, startOfMonth } from 'date-fns'

type Props = {
  params: {
    kakeiboId: string
    year: string
    month: string
  }
}

export default async function Page({ params }: Props) {
  const { kakeiboId, year, month } = params

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

  console.log(new Date(Date.UTC(Number(year), Number(month) - 1)))
  console.log(new Date(Date.UTC(Number(year), Number(month))))

  return (
    <>
      current month: {month}
      {histories.map((history) => (
        <div key={history.categoryId}>{Number(history._sum.price)}</div>
      ))}
    </>
  )
}
