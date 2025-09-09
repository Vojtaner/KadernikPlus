"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c513e6fe-8866-5e6f-8b38-a3261455035d")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.depositStatusOptions = exports.DepositStatus = void 0;
exports.DepositStatus = {
    NEZAPLACENO: "NEZAPLACENO",
    ZAPLACENO: "ZAPLACENO",
};
exports.depositStatusOptions = Object.entries(exports.DepositStatus).map(([key, value]) => ({
    id: key,
    name: value,
}));
//# sourceMappingURL=visit.js.map
//# debugId=c513e6fe-8866-5e6f-8b38-a3261455035d
