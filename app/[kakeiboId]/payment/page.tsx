import Payment from '@/components/payment'
import { CashFlow } from '@prisma/client'
import { Omit } from '@prisma/client/runtime/library'
import { createCashFlow, getCategories } from '../actions'

type Props = {
  params: Promise<{ kakeiboId: string }>
}

export default async function PaymentPage({ params }: Props) {
  const { kakeiboId } = await params

  const categories = await getCategories(kakeiboId)
  const createNewCashFlow = async (cashFlow: NewCashFlowType) => {
    'use server'
    await createCashFlow(cashFlow, kakeiboId)
  }

  return (
    <Payment categories={categories} createNewCashFlow={createNewCashFlow} />
  )
}

export type NewCashFlowType = Omit<CashFlow, 'id' | 'kakeiboId' | 'price'> & {
  price: number
}
