"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="f2bbfa69-df59-555a-afc2-b7707f61b15a")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
const ensureUserExistsMiddleware = (ensureUserExistsUseCase) => {
    return async (req, res, next) => {
        try {
            const userId = req.auth?.payload.sub;
            if (!userId) {
                res.status(401).json({ error: "Chybí uživatelské ID." });
                return;
            }
            await ensureUserExistsUseCase.execute(userId);
            next();
        }
        catch (err) {
            console.error("ensureUserExists error:", err);
            res.status(500).json({ error: "Failed to ensure user exists" });
        }
    };
};
exports.default = ensureUserExistsMiddleware;
//# sourceMappingURL=ensureUserExistsMiddleware.js.map
//# debugId=f2bbfa69-df59-555a-afc2-b7707f61b15a
