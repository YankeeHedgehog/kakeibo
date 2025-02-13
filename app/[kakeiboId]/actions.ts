'use server'

import prisma from '@/lib/prisma'
import { NewCashFlowType } from './payment/page'
import { Decimal } from '@prisma/client/runtime/library'

export async function getCategories(kakeiboId: string) {
  return await prisma.category.findMany({
    where: {
      kakeiboId: kakeiboId,
    },
  })
}

export async function getUsers(kakeiboId: string) {
  return await prisma.user.findMany({
    where: {
      kakeiboId: kakeiboId,
    },
  })
}

export async function createCashFlow(
  cashFlow: NewCashFlowType,
  kakeiboId: string
) {
  const newCashFlow = {
    ...cashFlow,
    kakeiboId: kakeiboId,
    price: new Decimal(cashFlow.price),
  }
  await prisma.cashFlow.create({ data: newCashFlow })
}
