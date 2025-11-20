import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import helmet from 'helmet'
import { AppModule } from './app.module'


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.use(helmet())
  app.enableCors({
    origin: true,
    credentials: true
  })

  // app.useStaticAssets(UPLOAD_DIR, {
  //   prefix: '/media/static'
  // })
  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
