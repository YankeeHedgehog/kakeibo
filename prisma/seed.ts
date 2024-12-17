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
      id: '6ad449a0-6980-4923-aef5-376727e1ad76',
      name: '交通費',
      icon: 'car-front',
    },
    {
      id: 'cdc15a32-ad40-449c-af84-723615684210',
      name: '夜ごはん',
      icon: 'utensils-crossed',
    },
    {
      id: 'f7495433-84ce-406e-85df-0f41fcc08701',
      name: '光熱費',
      icon: 'lightbulb',
    },
    {
      id: 'cdd77371-e036-487c-8b83-c9852994f6b1',
      name: '昼ごはん',
      icon: 'sandwich',
    },
    {
      id: '2986b9d4-7496-4e71-a826-e763d7422d66',
      name: '趣味',
      icon: 'tree-palm',
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

  // ユーザーの作成
  await prisma.users.upsert({
    where: { email: 'stey@vercel.com' },
    update: {},
    create: {
      name: 'Steven Tey',
      email: 'stey@vercel.com',
      image:
        'https://images.ctfassets.net/e5382hct74si/4QEuVLNyZUg5X6X4cW4pVH/eb7cd219e21b29ae976277871cd5ca4b/profile.jpg',
    },
  })

  console.log('データ作成が完了しました。')
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
