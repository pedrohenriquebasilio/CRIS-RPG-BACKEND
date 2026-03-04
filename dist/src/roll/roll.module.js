"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RollModule = void 0;
const common_1 = require("@nestjs/common");
const roll_service_1 = require("./roll.service");
const roll_controller_1 = require("./roll.controller");
let RollModule = class RollModule {
};
exports.RollModule = RollModule;
exports.RollModule = RollModule = __decorate([
    (0, common_1.Module)({
        providers: [roll_service_1.RollService],
        controllers: [roll_controller_1.RollController],
        exports: [roll_service_1.RollService],
    })
], RollModule);
//# sourceMappingURL=roll.module.js.map