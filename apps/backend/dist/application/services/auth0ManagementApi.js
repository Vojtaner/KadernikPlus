"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth0ManagementApi = void 0;
const getEnvVar_1 = require("../../utils/getEnvVar");
const auth0_1 = require("auth0");
exports.auth0ManagementApi = new auth0_1.ManagementClient({
    clientId: (0, getEnvVar_1.getEnvVar)("AUTH0_M2M_CLIENT_ID"),
    clientSecret: (0, getEnvVar_1.getEnvVar)("AUTH0_M2M_CLIENT_SECRET"),
    domain: (0, getEnvVar_1.getEnvVar)("AUTH0_M2M_DOMAIN"),
});
