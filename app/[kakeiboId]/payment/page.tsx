import Payment from '@/components/payment'
import { CashFlow } from '@prisma/client'
import { Omit } from '@prisma/client/runtime/library'
import { createCashFlow, getCategories, getUsers } from '../actions'

type Props = {
  params: Promise<{ kakeiboId: string }>
}

export default async function PaymentPage({ params }: Props) {
  const { kakeiboId } = await params

  const categories = await getCategories(kakeiboId)
  const users = await getUsers(kakeiboId)
  const createNewCashFlow = async (cashFlow: NewCashFlowType) => {
    'use server'
    await createCashFlow(cashFlow, kakeiboId)
  }

  return (
    <Payment
      categories={categories}
      users={users}
      createNewCashFlow={createNewCashFlow}
    />
  )
}

export type NewCashFlowType = Omit<CashFlow, 'id' | 'kakeiboId' | 'price'> & {
  price: number
}
