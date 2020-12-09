import { NestFactory, Reflector } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io/adapters/io-adapter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RolesGuard } from './guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get<Reflector>(Reflector);
  app.useGlobalGuards(new RolesGuard(reflector));
  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('/api');

  const options = new DocumentBuilder()
    .setTitle('Caro API')
    .setDescription('The Caro API description')
    .setVersion('1.0')
    .addTag('caro')
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
    })
    .build();
  app.useWebSocketAdapter(new IoAdapter(app));
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(4101);
}
bootstrap();
