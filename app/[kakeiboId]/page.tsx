import { Button } from '@/components/ui/button'
import formatDateToJapanese from '@/utils/format-date-to-jp'
import { endOfMonth, startOfMonth } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ kakeiboId: string }>
}

export default async function HomePage({ params }: Props) {
  const today = new Date()
  const { kakeiboId } = await params

  const monthPayment = await prisma.cashFlow.aggregate({
    _sum: {
      price: true,
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
    <div className="max-w-[600px]">
      <header className="flex flex-col items-center gap-2">
        <h1 className="text-3xl">もんちゃんかけいぼ</h1>
        <p className="text-xl">{formatDateToJapanese(today)}</p>
      </header>
      <main className="flex flex-col mt-8 items-center gap-1">
        <p className="flex w-full justify-between text-2xl rounded-2xl p-3 bg-primary text-primary-foreground">
          <span>今月の出費</span>
          <span>{Number(monthPayment._sum.price)}円</span>
        </p>
        <Link href={`${kakeiboId}/payment`} className="mt-3 underline text-xl">
          入力する!
        </Link>
        <Image
          src="/yankee-hedgehog.webp"
          width={300}
          height={300}
          alt="Picture of the author"
          className="w-full"
        />
        <div id="nav-group" className="flex flex-row gap-3">
          <Button>ホーム</Button>
          <Button>
            <Link href={`${kakeiboId}/history/list/`}>履歴</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
