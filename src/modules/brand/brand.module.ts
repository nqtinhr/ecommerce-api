import { Module } from '@nestjs/common'
import { BrandController } from './brand.controller'
import { BrandRepo } from './brand.repo'
import { BrandService } from './brand.service'

@Module({
  providers: [BrandService, BrandRepo],
  controllers: [BrandController],
})
export class BrandModule {}
