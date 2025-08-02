import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserThrottlerGuard } from './common/guards/user-throttler.guard';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import 'module-alias/register';
import { SwaggerTransformPipe } from './common/pipes/swagger-transform.pipe';
import { SequelizeExceptionFilter } from './filters/sequelize-exception.filter';

async function bootstrap() {
  // Load environment variables from .env
  dotenv.config({
    path: `.env.${process.env.NODE_ENV || 'local'}`,
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1); // <-- VERY IMPORTANT
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // Temporary: Allow all origins (for development/debugging only)
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
  });

  // Global validation
  app.useGlobalPipes(
    new SwaggerTransformPipe(),
    new ValidationPipe({ transform: true }),
  );

  app.useGlobalFilters(new SequelizeExceptionFilter());
  // app.useGlobalInterceptors(new ResponseInterceptor());

  app.use('/docs', (req, res, next) => {
    const auth = { login: 'dev', password: 'glorek' }; // <- set your credentials here

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64')
      .toString()
      .split(':');

    if (login === auth.login && password === auth.password) {
      return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="Restricted Area"');
    res.status(401).send('Authentication required.');
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Glorek API')
    .setDescription('API Docs')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: -1,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const jwtAuthGuard = app.get(JwtAuthGuard);
  const userThrottlerGuard = app.get(UserThrottlerGuard);
  app.useGlobalGuards(jwtAuthGuard, userThrottlerGuard);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
