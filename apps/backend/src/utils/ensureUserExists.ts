import { Request, Response, NextFunction } from "express";
import { managementApi } from "../infrastructure/services/auth0";
import { PrismaClient } from "@prisma/client";

export const ensureUserExists = (prisma: PrismaClient) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.auth?.payload.sub;

    if (!userId) {
      throw new Error("User could not be created.");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    try {
      const result = await managementApi.users.get({
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
    } catch (err) {
      console.error("ensureUserExists error:", err);
      res.status(500).json({ error: "Failed to ensure user exists" });
    }
  };
};
