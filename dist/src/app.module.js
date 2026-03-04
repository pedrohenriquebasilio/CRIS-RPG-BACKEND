"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const campaign_module_1 = require("./campaign/campaign.module");
const character_module_1 = require("./character/character.module");
const roll_module_1 = require("./roll/roll.module");
const combat_module_1 = require("./combat/combat.module");
const npc_module_1 = require("./npc/npc.module");
const gateway_module_1 = require("./gateway/gateway.module");
const seeds_module_1 = require("./seeds/seeds.module");
const specializations_module_1 = require("./specializations/specializations.module");
const technique_template_module_1 = require("./technique-template/technique-template.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            campaign_module_1.CampaignModule,
            character_module_1.CharacterModule,
            roll_module_1.RollModule,
            combat_module_1.CombatModule,
            npc_module_1.NpcModule,
            gateway_module_1.GatewayModule,
            seeds_module_1.SeedsModule,
            specializations_module_1.SpecializationsModule,
            technique_template_module_1.TechniqueTemplateModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map