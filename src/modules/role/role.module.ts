import { Module } from '@nestjs/common'
import { RoleController } from './role.controller'
import { RoleRepo } from './role.repo'
import { RoleService } from './role.service'

@Module({
  providers: [RoleService, RoleRepo],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
