import prisma from '@/lib/prisma'
import { endOfMonth, startOfMonth } from 'date-fns'

type Props = {
  params: {
    kakeiboId: string
    year: string
  }
}

export default async function Page({ params }: Props) {
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
      {histories.map((history) => (
        <div key={history.categoryId}>{Number(history._sum.price)}</div>
      ))}
    </>
  )
}
