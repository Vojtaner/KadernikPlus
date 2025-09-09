"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e93a20f8-1bcc-5215-93d0-a136b87abfe3")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvVar = void 0;
const getEnvVar = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};
exports.getEnvVar = getEnvVar;
//# sourceMappingURL=getEnvVar.js.map
//# debugId=e93a20f8-1bcc-5215-93d0-a136b87abfe3
