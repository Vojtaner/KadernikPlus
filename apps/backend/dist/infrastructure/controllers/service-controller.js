"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_all_services_1 = __importDefault(require("../../application/use-cases/service/get-all-services"));
const add_service_1 = __importDefault(require("../../application/use-cases/service/add-service"));
const createServiceController = (dependencies) => {
    const addServiceController = async (httpRequest) => {
        const { serviceName, basePrice } = httpRequest.body;
        const userId = httpRequest.userId;
        const serviceData = {
            serviceName,
            basePrice: Number(basePrice),
            userId,
        };
        const newService = await dependencies.addServiceUseCase.execute(serviceData);
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
        addServiceController,
        getAllServicesController,
    };
};
const serviceController = createServiceController({
    addServiceUseCase: add_service_1.default,
    getAllServicesUseCase: get_all_services_1.default,
});
exports.default = serviceController;
