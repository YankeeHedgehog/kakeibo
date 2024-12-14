'use client'

import { Button } from '@/components/ui/button'
import formatDateToJapanese from '@/utils/format-date-to-jp'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  const today = new Date()

  const params = useParams<{ kakeiboId: string }>()

  console.log(params.kakeiboId)

  return (
    <div className="max-w-[600px]">
      <header className="flex flex-col items-center gap-2">
        <h1 className="text-3xl">もんちゃんかけいぼ</h1>
        <p className="text-xl">{formatDateToJapanese(today)}</p>
      </header>
      <main className="flex flex-col mt-8 items-center gap-1">
        <p className="flex w-full justify-between text-2xl rounded-2xl p-3 bg-red-300">
          <span>今月の出費</span>
          <span>148,00円</span>
        </p>
        <Link
          href={`${params.kakeiboId}/payment`}
          className="mt-3 underline text-xl"
        >
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
          <Button>履歴</Button>
        </div>
      </main>
    </div>
  )
}
