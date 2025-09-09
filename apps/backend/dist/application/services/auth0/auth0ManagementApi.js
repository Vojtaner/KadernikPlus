"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="8393c5f5-542b-5208-b2b0-19a65633a5c4")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.auth0ManagementApi = void 0;
const getEnvVar_1 = require("../../../utils/getEnvVar");
const auth0_1 = require("auth0");
exports.auth0ManagementApi = new auth0_1.ManagementClient({
    clientSecret: (0, getEnvVar_1.getEnvVar)("AUTH0_M2M_CLIENT_SECRET"),
    clientId: (0, getEnvVar_1.getEnvVar)("AUTH0_M2M_CLIENT_ID"),
    domain: (0, getEnvVar_1.getEnvVar)("AUTH0_M2M_DOMAIN"),
});
//# sourceMappingURL=auth0ManagementApi.js.map
//# debugId=8393c5f5-542b-5208-b2b0-19a65633a5c4
