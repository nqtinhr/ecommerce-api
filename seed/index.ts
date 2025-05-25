import envConfig from 'src/shared/config'
import { RoleName } from 'src/shared/constants/role.constant'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

// npx ts-node seed
const prismaService = new PrismaService()
const hashingService = new HashingService()

const main = async () => {
  const roleCount = await prismaService.role.count()
  if (roleCount > 0) {
    throw new Error('Roles already exists')
  }

  const roles = await prismaService.role.createMany({
    data: [
      {
        name: RoleName.Admin,
        description: 'Admin role'
      },
      {
        name: RoleName.Client,
        description: 'Client role'
      },
      {
        name: RoleName.Seller,
        description: 'Seller role'
      }
    ]
  })

  const adminRole = await prismaService.role.findFirstOrThrow({
    where: {
      name: RoleName.Admin
    }
  })

  const hashedPassword = await hashingService.hash(envConfig.ADMIN_PASSWORD)
  const adminUser = await prismaService.user.create({
    data: {
      email: envConfig.ADMIN_EMAIL,
      name: envConfig.ADMIN_NAME,
      password: hashedPassword,
      phoneNumber: envConfig.ADMIN_PHONE_NUMBER,
      roleId: adminRole.id
    }
  })

  return {
    createdRoleCount: roles.count,
    adminUser
  }
}

main()
  .then(({ createdRoleCount, adminUser }) => {
    console.log(`Created ${createdRoleCount} roles and admin user`)
    console.log(`Created admin user: ${adminUser.email}`)
  })
  .catch(console.error)
