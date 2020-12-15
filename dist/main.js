"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const io_adapter_1 = require("@nestjs/platform-socket.io/adapters/io-adapter");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const roles_guard_1 = require("./guards/roles.guard");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const reflector = app.get(core_1.Reflector);
    app.useGlobalGuards(new roles_guard_1.RolesGuard(reflector));
    app.enableCors({
        origin: '*',
    });
    app.setGlobalPrefix('/api');
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Caro API')
        .setDescription('The Caro API description')
        .setVersion('1.0')
        .addTag('caro')
        .addSecurity('bearer', {
        type: 'http',
        scheme: 'bearer',
    })
        .build();
    app.useWebSocketAdapter(new io_adapter_1.IoAdapter(app));
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(4101);
}
bootstrap();
//# sourceMappingURL=main.js.map