import { Module } from '@nestjs/common'
import { ManageProductController } from './manage-product.controller'
import { ManageProductService } from './manage-product.service'
import { ProductController } from './product.controller'
import { ProductRepo } from './product.repo'
import { ProductService } from './product.service'

@Module({
  providers: [ProductService, ManageProductService, ProductRepo],
  controllers: [ProductController, ManageProductController],
})
export class ProductModule {}
