"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureUserExists = void 0;
const auth0_1 = require("../infrastructure/services/auth0");
const ensureUserExists = (prisma) => {
    return async (req, res, next) => {
        const userId = req.auth?.payload.sub;
        if (!userId) {
            throw new Error("User could not be created.");
        }
        const user = await prisma.user.findUnique({ where: { id: userId } });
        try {
            const result = await auth0_1.managementApi.users.get({
                id: userId,
            });
            if (!user) {
                await prisma.user.create({
                    data: {
                        id: userId,
                        email: result.data.email,
                        name: result.data.name,
                        createdAt: new Date(),
                        authProvider: "auth0",
                    },
                });
            }
            next();
        }
        catch (err) {
            console.error("ensureUserExists error:", err);
            res.status(500).json({ error: "Failed to ensure user exists" });
        }
    };
};
exports.ensureUserExists = ensureUserExists;
