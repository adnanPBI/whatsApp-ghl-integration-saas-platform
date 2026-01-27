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
exports.WhatsappAccount = void 0;
const typeorm_1 = require("typeorm");
const tenant_entity_1 = require("../../tenant/entities/tenant.entity");
const ghl_subaccount_entity_1 = require("../../ghl/entities/ghl-subaccount.entity");
let WhatsappAccount = class WhatsappAccount {
};
exports.WhatsappAccount = WhatsappAccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WhatsappAccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WhatsappAccount.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WhatsappAccount.prototype, "ghl_subaccount_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], WhatsappAccount.prototype, "phone_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], WhatsappAccount.prototype, "phone_number_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WhatsappAccount.prototype, "waba_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WhatsappAccount.prototype, "business_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], WhatsappAccount.prototype, "access_token", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], WhatsappAccount.prototype, "webhook_verify_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], WhatsappAccount.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WhatsappAccount.prototype, "quality_rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], WhatsappAccount.prototype, "messaging_limit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], WhatsappAccount.prototype, "last_synced_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], WhatsappAccount.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], WhatsappAccount.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], WhatsappAccount.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], WhatsappAccount.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ghl_subaccount_entity_1.GhlSubaccount, (subaccount) => subaccount.whatsapp_accounts),
    (0, typeorm_1.JoinColumn)({ name: 'ghl_subaccount_id' }),
    __metadata("design:type", ghl_subaccount_entity_1.GhlSubaccount)
], WhatsappAccount.prototype, "ghl_subaccount", void 0);
exports.WhatsappAccount = WhatsappAccount = __decorate([
    (0, typeorm_1.Entity)('whatsapp_accounts')
], WhatsappAccount);
//# sourceMappingURL=whatsapp-account.entity.js.map