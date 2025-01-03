import prisma from '../lib/prisma'

async function main() {
  const kakeiboId = 'bd0744e1-b63d-473e-925f-47efe373e300'

  // Kakeiboの作成
  await prisma.kakeibo.upsert({
    where: { id: kakeiboId },
    update: {},
    create: { id: kakeiboId },
  })

  // Categoryの作成
  const categories = [
    {
      id: 'cdd77371-e036-487c-8b83-c9852994f6b1',
      name: '昼ごはん',
      icon: 'sandwich',
    },
    {
      id: 'cdc15a32-ad40-449c-af84-723615684210',
      name: '夜ごはん',
      icon: 'utensils-crossed',
    },
    {
      id: 'e024cafc-06d5-4c6d-989f-450980560484',
      name: '家賃/生活固定費',
      icon: 'house-plus',
    },
    {
      id: '6ad449a0-6980-4923-aef5-376727e1ad76',
      name: '車/交通費',
      icon: 'car-front',
    },
    {
      id: 'f7495433-84ce-406e-85df-0f41fcc08701',
      name: '水道光熱費',
      icon: 'lightbulb',
    },
    {
      id: 'b90eb6b2-f873-432c-9327-6147ae90bb49',
      name: '固定費(その他)',
      icon: 'picture-in-picture-2',
    },
    {
      id: '2986b9d4-7496-4e71-a826-e763d7422d66',
      name: '医療費',
      icon: 'stethoscope',
    },

    {
      id: 'c062cacc-abbb-4ee1-b697-3e8a94c3acb1',
      name: '旅行',
      icon: 'luggage',
    },
    {
      id: '0bba1056-db1f-4c29-bf54-24a31124a669',
      name: 'その他',
      icon: 'box',
    },
  ]

  await Promise.all(
    categories.map((category) =>
      prisma.category.upsert({
        where: { id: category.id },
        update: {},
        create: {
          id: category.id,
          name: category.name,
          icon: category.icon,
          kakeiboId: kakeiboId,
        },
      })
    )
  )

  // CashFlowの作成
  const cashFlows = [
    {
      price: 1200,
      memo: 'バス代',
      categoryId: '6ad449a0-6980-4923-aef5-376727e1ad76', // 交通費
      timestamp: new Date('2024-06-01'),
    },
    {
      price: 3500,
      memo: '焼肉ディナー',
      categoryId: 'cdc15a32-ad40-449c-af84-723615684210', // 夜ごはん
      timestamp: new Date('2024-06-02'),
    },
    {
      price: 8000,
      memo: '電気代',
      categoryId: 'f7495433-84ce-406e-85df-0f41fcc08701', // 光熱費
      timestamp: new Date('2024-06-03'),
    },
    {
      price: 850,
      memo: 'カフェランチ',
      categoryId: 'cdd77371-e036-487c-8b83-c9852994f6b1', // 昼ごはん
      timestamp: new Date('2024-06-04'),
    },
    {
      price: 1500,
      memo: '映画館のチケット',
      categoryId: '2986b9d4-7496-4e71-a826-e763d7422d66', // 趣味
      timestamp: new Date('2024-06-05'),
    },
  ]

  await Promise.all(
    cashFlows.map((cashFlow) =>
      prisma.cashFlow.create({
        data: {
          price: cashFlow.price,
          memo: cashFlow.memo,
          timestamp: cashFlow.timestamp,
          kakeiboId: kakeiboId,
          categoryId: cashFlow.categoryId,
        },
      })
    )
  )
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
