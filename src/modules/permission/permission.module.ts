import { Module } from '@nestjs/common'
import { PermissionController } from './permission.controller'
import { PermissionRepo } from './permission.repo'
import { PermissionService } from './permission.service'

@Module({
  providers: [PermissionService, PermissionRepo],
  controllers: [PermissionController],
})
export class PermissionModule {}
