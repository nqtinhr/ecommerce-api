import { Module } from '@nestjs/common'
import { ProductTranslationController } from './product-translation/product-translation.controller'
import { ProductTranslationRepo } from './product-translation/product-translation.repo'
import { ProductTranslationService } from './product-translation/product-translation.service'

@Module({
  providers: [ProductTranslationRepo, ProductTranslationService],
  controllers: [ProductTranslationController],
})
export class ProductTranslationModule {}
