import { Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenGuard } from './guards/access-token.guard'
import { AuthenticationGuard } from './guards/authentication.guard'
import { HashingService } from './services/hashing.service'
import { PrismaService } from './services/prisma.service'
import { TokenService } from './services/token.service'
import { PaymentAPIKeyGuard } from './guards/payment-api-key.guard'
import { EmailService } from './services/email.service'
import { TwoFactorService } from './services/2fa.service'
import { SharedRoleRepository } from './repositories/shared-role.repo'
import { SharedUserRepository } from './repositories/shared-user.repo'

const sharedServices = [
  PrismaService,
  HashingService,
  TokenService,
  EmailService,
  TwoFactorService,
  SharedRoleRepository,
  SharedUserRepository,
  // SharedPaymentRepository,
  // SharedWebsocketRepository,
  // S3Service
]

@Global()
@Module({
  providers: [
    ...sharedServices,
    AccessTokenGuard,
    PaymentAPIKeyGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  exports: sharedServices,
  imports: [JwtModule],
})
export class SharedModule {}
