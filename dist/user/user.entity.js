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
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const argon2 = require("argon2");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
let User = class User extends typeorm_1.BaseEntity {
    async validatePassword(password) {
        return await argon2.verify(this.password, password);
    }
};
__decorate([
    swagger_1.ApiProperty(),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    swagger_1.ApiProperty(),
    typeorm_1.Column(),
    class_transformer_1.Exclude(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    swagger_1.ApiProperty(),
    typeorm_1.Column({
        default: 'user',
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    swagger_1.ApiProperty(),
    typeorm_1.Column({
        default: null,
    }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    swagger_1.ApiProperty(),
    typeorm_1.Column({
        default: 1000,
    }),
    __metadata("design:type", Number)
], User.prototype, "points", void 0);
__decorate([
    swagger_1.ApiProperty(),
    typeorm_1.Column({
        default: 0,
    }),
    __metadata("design:type", Number)
], User.prototype, "winnum", void 0);
__decorate([
    swagger_1.ApiProperty(),
    typeorm_1.Column({
        default: 0,
    }),
    __metadata("design:type", Number)
], User.prototype, "drawnum", void 0);
__decorate([
    swagger_1.ApiProperty(),
    typeorm_1.Column({
        default: 0,
    }),
    __metadata("design:type", Number)
], User.prototype, "losenum", void 0);
User = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Unique(['username'])
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map