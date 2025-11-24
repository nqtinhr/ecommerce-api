import { Module } from '@nestjs/common'
import { CategoryTranslationController } from './category-translation.controller'
import { CategoryTranslationRepo } from './category-translation.repo'
import { CategoryTranslationService } from './category-translation.service'

@Module({
  providers: [CategoryTranslationRepo, CategoryTranslationService],
  controllers: [CategoryTranslationController],
})
export class CategoryTranslationModule {}
