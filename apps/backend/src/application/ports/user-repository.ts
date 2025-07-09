import { User, UserCreateData } from "@/entities/user";

export type UserRepositoryPort = {
  add(userData: UserCreateData): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
};
