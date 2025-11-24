import { createKeyv } from '@keyv/redis'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import path from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { BrandTranslationModule } from './modules/brand-translation/brand-translation.module'
import { BrandModule } from './modules/brand/brand.module'
import { CategoryTranslationModule } from './modules/category-translation/category-translation.module'
import { CategoryModule } from './modules/category/category.module'
import { LanguageModule } from './modules/language/language.module'
import { MediaModule } from './modules/media/media.module'
import { PermissionModule } from './modules/permission/permission.module'
import { ProductTranslationModule } from './modules/product-translation/product-translation.module'
import { ProductModule } from './modules/product/product.module'
import { ProfileModule } from './modules/profile/profile.module'
import { RoleModule } from './modules/role/role.module'
import { UserModule } from './modules/user/user.module'
import envConfig from './shared/config'
import { HttpExceptionFilter } from './shared/filters/http-exception.filter'
import CustomZodValidationPipe from './shared/pipes/custom-zod-validation.pipe'
import { SharedModule } from './shared/shared.module'

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          stores: [createKeyv(envConfig.REDIS_URL)]
        }
      }
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.resolve('src/i18n/'),
        watch: true
      },
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
      typesOutputPath: path.resolve('src/generated/i18n.generated.ts')
    }),
    SharedModule,
    AuthModule,
    LanguageModule,
    PermissionModule,
    RoleModule,
    ProfileModule,
    UserModule,
    MediaModule,
    BrandModule,
    BrandTranslationModule,
    CategoryModule,
    CategoryTranslationModule,
    ProductModule,
    ProductTranslationModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {}
