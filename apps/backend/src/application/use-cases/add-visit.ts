import { Visit, VisitCreateData } from "@/entities/visit";
import { VisitRepositoryPort } from "@/application/ports/visit-repository";
import visitRepositoryDb from "../../infrastructure/data/prisma/prisma-visit-repository";

export function UserNotFoundError(id: string): Error {
  const error = new Error(`User with ID '${id}' not found.`);
  error.name = "UserNotFoundError";
  return error;
}

export function ClientNotFoundError(id: string): Error {
  const error = new Error(`Client with ID '${id}' not found.`);
  error.name = "ClientNotFoundError";
  return error;
}

const createAddVisitUseCase = (dependencies: {
  visitRepositoryDb: VisitRepositoryPort;
}) => ({
  execute: async (visitData: VisitCreateData): Promise<Visit> => {
    const visit = await visitRepositoryDb.add(visitData);

    // a další logika s přidáním návštěvy emaily, jiné databázové operace atd...

    return visit;
  },
});

export type CreateAddVisitUseCaseType = ReturnType<
  typeof createAddVisitUseCase
>;

export const addVisitUseCase = createAddVisitUseCase({ visitRepositoryDb });
