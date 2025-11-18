import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { UserRepo } from './user.repo'
import { UserService } from './user.service'

@Module({
  providers: [UserService, UserRepo],
  controllers: [UserController],
})
export class UserModule {}
