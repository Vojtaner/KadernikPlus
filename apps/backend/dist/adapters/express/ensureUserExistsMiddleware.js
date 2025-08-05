"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ensureUserExistsMiddleware = (ensureUserExistsUseCase) => {
    return async (req, res, next) => {
        try {
            const userId = req.auth?.payload.sub;
            if (!userId) {
                res.status(401).json({ error: "Missing user id." });
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
