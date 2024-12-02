import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVER_PORT } from './commons/constants/envirements';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './commons/interceptors/transform.interceptor';
import { ExceptionsFilter } from './commons/filters/exceptions.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(helmet());
  // const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  // app.useLogger(logger);
  // app.useGlobalFilters(new ExceptionsFilter(app.get(HttpAdapterHost), logger));
  // app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('OzMap API')
    .setDescription('Api para test OzMap')
    .setVersion('0.8')
    .addTag('OZ MAP')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(SERVER_PORT || 3000);
}
bootstrap();
