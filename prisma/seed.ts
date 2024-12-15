import prisma from '../lib/prisma'

async function main() {
  const response = await Promise.all([
    prisma.kakeibo.upsert({
      where: { id: 'bd0744e1-b63d-473e-925f-47efe373e300' },
      update: {},
      create: {
        id: 'bd0744e1-b63d-473e-925f-47efe373e300',
      },
    }),
    await prisma.category.upsert({
      where: { id: '6ad449a0-6980-4923-aef5-376727e1ad76' },
      update: {},
      create: {
        id: '6ad449a0-6980-4923-aef5-376727e1ad76',
        name: '交通費',
        icon: 'car-front',
        kakeiboId: 'bd0744e1-b63d-473e-925f-47efe373e300',
      },
    }),
    await prisma.category.upsert({
      where: { id: 'cdc15a32-ad40-449c-af84-723615684210' },
      update: {},
      create: {
        id: 'cdc15a32-ad40-449c-af84-723615684210',
        name: '夜ごはん',
        icon: 'utensils-crossed',
        kakeiboId: 'bd0744e1-b63d-473e-925f-47efe373e300',
      },
    }),
    await prisma.category.upsert({
      where: { id: 'f7495433-84ce-406e-85df-0f41fcc08701' },
      update: {},
      create: {
        id: 'f7495433-84ce-406e-85df-0f41fcc08701',
        name: '光熱費',
        icon: 'lightbulb',
        kakeiboId: 'bd0744e1-b63d-473e-925f-47efe373e300',
      },
    }),
    await prisma.category.upsert({
      where: { id: 'cdd77371-e036-487c-8b83-c9852994f6b1' },
      update: {},
      create: {
        id: 'cdd77371-e036-487c-8b83-c9852994f6b1',
        name: '昼ごはん',
        icon: 'sandwich',
        kakeiboId: 'bd0744e1-b63d-473e-925f-47efe373e300',
      },
    }),
    await prisma.category.upsert({
      where: { id: '2986b9d4-7496-4e71-a826-e763d7422d66' },
      update: {},
      create: {
        id: '2986b9d4-7496-4e71-a826-e763d7422d66',
        name: '趣味',
        icon: 'tree-palm',
        kakeiboId: 'bd0744e1-b63d-473e-925f-47efe373e300',
      },
    }),
    await prisma.users.upsert({
      where: { email: 'stey@vercel.com' },
      update: {},
      create: {
        name: 'Steven Tey',
        email: 'stey@vercel.com',
        image:
          'https://images.ctfassets.net/e5382hct74si/4QEuVLNyZUg5X6X4cW4pVH/eb7cd219e21b29ae976277871cd5ca4b/profile.jpg',
      },
    }),
  ])
  console.log(response)
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
