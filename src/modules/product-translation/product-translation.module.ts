import { Module } from '@nestjs/common'
import { ProductTranslationController } from './product-translation.controller'
import { ProductTranslationRepo } from './product-translation.repo'
import { ProductTranslationService } from './product-translation.service'

@Module({
  providers: [ProductTranslationRepo, ProductTranslationService],
  controllers: [ProductTranslationController],
})
export class ProductTranslationModule {}
