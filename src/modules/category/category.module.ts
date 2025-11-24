import { Module } from '@nestjs/common'
import { CategoryController } from './category.controller'
import { CategoryRepo } from './category.repo'
import { CategoryService } from './category.service'

@Module({
  providers: [CategoryService, CategoryRepo],
  controllers: [CategoryController],
})
export class CategoryModule {}
