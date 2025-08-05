import { Request, Response, NextFunction } from "express";
import { type EnsureUserExistsUseCaseType } from "../../application/use-cases/user/ensure-user-exists";

const ensureUserExistsMiddleware = (
  ensureUserExistsUseCase: EnsureUserExistsUseCaseType
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.auth?.payload.sub;

      if (!userId) {
        res.status(401).json({ error: "Missing user id." });
        return;
      }

      await ensureUserExistsUseCase.execute(userId);
      next();
    } catch (err) {
      console.error("ensureUserExists error:", err);
      res.status(500).json({ error: "Failed to ensure user exists" });
    }
  };
};

export default ensureUserExistsMiddleware;
