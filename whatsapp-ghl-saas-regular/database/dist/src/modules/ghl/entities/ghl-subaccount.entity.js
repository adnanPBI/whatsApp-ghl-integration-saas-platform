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
exports.GhlSubaccount = void 0;
const typeorm_1 = require("typeorm");
const tenant_entity_1 = require("../../tenant/entities/tenant.entity");
const whatsapp_account_entity_1 = require("../../whatsapp/entities/whatsapp-account.entity");
const contact_entity_1 = require("../../contact/entities/contact.entity");
let GhlSubaccount = class GhlSubaccount {
};
exports.GhlSubaccount = GhlSubaccount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GhlSubaccount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GhlSubaccount.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], GhlSubaccount.prototype, "ghl_location_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GhlSubaccount.prototype, "ghl_company_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], GhlSubaccount.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GhlSubaccount.prototype, "access_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GhlSubaccount.prototype, "refresh_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], GhlSubaccount.prototype, "token_expires_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GhlSubaccount.prototype, "webhook_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], GhlSubaccount.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], GhlSubaccount.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], GhlSubaccount.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], GhlSubaccount.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant, (tenant) => tenant.ghl_subaccounts),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], GhlSubaccount.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => whatsapp_account_entity_1.WhatsappAccount, (account) => account.ghl_subaccount),
    __metadata("design:type", Array)
], GhlSubaccount.prototype, "whatsapp_accounts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => contact_entity_1.Contact, (contact) => contact.ghl_subaccount),
    __metadata("design:type", Array)
], GhlSubaccount.prototype, "contacts", void 0);
exports.GhlSubaccount = GhlSubaccount = __decorate([
    (0, typeorm_1.Entity)('ghl_subaccounts')
], GhlSubaccount);
//# sourceMappingURL=ghl-subaccount.entity.js.map