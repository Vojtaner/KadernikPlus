"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositStatusOptions = exports.DepositStatus = void 0;
exports.DepositStatus = {
    NEZAPLACENO: 'NEZAPLACENO',
    ZAPLACENO: 'ZAPLACENO',
};
exports.depositStatusOptions = Object.entries(exports.DepositStatus).map(([key, value]) => ({
    id: key,
    name: value,
}));
