import { Module } from '@nestjs/common'
import { BrandTranslationController } from './brand-translation.controller'
import { BrandTranslationRepo } from './brand-translation.repo'
import { BrandTranslationService } from './brand-translation.service'

@Module({
  providers: [BrandTranslationRepo, BrandTranslationService],
  controllers: [BrandTranslationController],
})
export class BrandTranslationModule {}
