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
    const userId = req.auth?.payload.sub;

    if (!userId) {
      res.status(401).json({ error: "Chybí uživatelské ID." });
      return;
    }

    await ensureUserExistsUseCase.execute(userId);

    next();
  };
};

export default ensureUserExistsMiddleware;
