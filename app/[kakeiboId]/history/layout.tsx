'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, ChartPie, Menu } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function HistoryLayout({ children }: Props) {
  const router = useRouter()
  const params = useParams()

  const listOrChart = usePathname().split('/').slice(-1)[0]
  const tabsDefaultValue = listOrChart === 'chart' ? 'chart' : 'list'

  const kakeiboId = params.kakeiboId

  return (
    <>
      <header className="grid grid-cols-3 items-center px-3 pb-2">
        <ArrowLeft onClick={() => router.push(`/${kakeiboId}`)} />
        <p className="text-center text-xl">履歴</p>
        <div className="ml-auto">
          <Tabs
            defaultValue={tabsDefaultValue}
            className="flex justify-center mt-3"
          >
            <TabsList>
              <TabsTrigger
                value="list"
                onClick={() => router.push(`/${kakeiboId}/history/list/`)}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Menu />
              </TabsTrigger>
              <TabsTrigger
                value="chart"
                onClick={() => router.push(`/${kakeiboId}/history/chart/`)}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ChartPie />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>
      {children}
    </>
  )
}
