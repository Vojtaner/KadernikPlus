import { HasId } from "@/domain/entity";
import { Team } from "@prisma/client";

export type TeamRepositoryPort = {
  create: (data: {
    name: string;
    userId: string;
  }) => Promise<HasId & { name: string }>;
  findById: (teamId: string) => Promise<Team | null>;
  findFirst: (userId: string) => Promise<Team | null>;
};
