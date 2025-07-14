"use strict";
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
