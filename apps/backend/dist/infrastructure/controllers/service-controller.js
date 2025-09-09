"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e95e632f-d51f-5075-b895-25c134b25f99")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_all_services_1 = __importDefault(require("../../application/use-cases/service/get-all-services"));
const add_or_update_service_1 = __importDefault(require("../../application/use-cases/service/add-or-update-service"));
const createServiceController = (dependencies) => {
    const addOrUpdateServiceController = async (httpRequest) => {
        const { serviceName, basePrice, teamId, id } = httpRequest.body;
        const userId = httpRequest.userId;
        const serviceData = {
            serviceName,
            basePrice,
            userId,
            teamId,
            id,
        };
        const newService = await dependencies.addOrUpdateServiceUseCase.execute(serviceData);
        return {
            statusCode: 201,
            body: newService,
        };
    };
    const getAllServicesController = async (httpRequest) => {
        const userId = httpRequest.userId;
        const services = await dependencies.getAllServicesUseCase.execute(userId);
        return {
            statusCode: 200,
            body: services,
        };
    };
    return {
        addOrUpdateServiceController,
        getAllServicesController,
    };
};
const serviceController = createServiceController({
    addOrUpdateServiceUseCase: add_or_update_service_1.default,
    getAllServicesUseCase: get_all_services_1.default,
});
exports.default = serviceController;
//# sourceMappingURL=service-controller.js.map
//# debugId=e95e632f-d51f-5075-b895-25c134b25f99
