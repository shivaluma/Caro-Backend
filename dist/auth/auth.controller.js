"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const register_credentials_dto_1 = require("./dto/register-credentials.dto");
const auth_service_1 = require("./auth.service");
const passport_1 = require("@nestjs/passport");
const login_credentials_dto_1 = require("./dto/login-credentials.dto");
const swagger_1 = require("@nestjs/swagger");
const role_decorator_1 = require("../utils/role.decorator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    signUp(authCredentialsDto) {
        return this.authService.signUp(authCredentialsDto);
    }
    signIn(authCredentialsDto) {
        return this.authService.signIn(authCredentialsDto);
    }
    test(req) {
        return { message: 'Normal route, all roles can get' };
    }
    test2(req) {
        return { message: 'Admin route' };
    }
};
__decorate([
    common_1.Post('/signup'),
    __param(0, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_credentials_dto_1.RegisterCredentialsDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    common_1.Post('/signin'),
    __param(0, common_1.Body(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_credentials_dto_1.LoginCredentialsDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    swagger_1.ApiBearerAuth(),
    common_1.Post('/test'),
    common_1.UseGuards(passport_1.AuthGuard()),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "test", null);
__decorate([
    swagger_1.ApiBearerAuth(),
    common_1.Post('/test2'),
    common_1.UseGuards(passport_1.AuthGuard()),
    role_decorator_1.Roles('admin'),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "test2", null);
AuthController = __decorate([
    common_1.Controller('auth'),
    swagger_1.ApiTags('Authentication'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map