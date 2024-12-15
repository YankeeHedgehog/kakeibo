import prisma from '@/lib/prisma'
import { endOfMonth, startOfMonth } from 'date-fns'

type Props = {
  params: {
    kakeiboId: string
  }
}

export default async function Page({ params }: Props) {
  const today = new Date()
  const { kakeiboId } = await params

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
        gte: startOfMonth(today),
        lte: endOfMonth(today),
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
