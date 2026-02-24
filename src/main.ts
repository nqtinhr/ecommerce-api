import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { cleanupOpenApiDoc } from 'nestjs-zod'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.set('trust proxy', 'loopback') // Trust requests from the loopback address
  app.use(helmet())
  app.enableCors({
    origin: true,
    credentials: true
  })

  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('The API for the ecommerce application')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey(
      {
        name: 'authorization',
        type: 'apiKey'
      },
      'payment-api-key'
    )
    .build()
  const documentFactory = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(documentFactory), {
    swaggerOptions: {
      persistAuthorization: true
    }
  })

  // app.useStaticAssets(UPLOAD_DIR, {
  //   prefix: '/media/static'
  // })
  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
