import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function HistoryLayout({ children }: Props) {
  return (
    <>
      <header className="grid grid-cols-3 items-center">
        <ArrowLeft />
        <p className="text-center text-xl">入力</p>
        <div className="ml-auto">
          <Button variant="ghost" type="submit">
            完了
          </Button>
        </div>
      </header>
      {children}
    </>
  )
}
