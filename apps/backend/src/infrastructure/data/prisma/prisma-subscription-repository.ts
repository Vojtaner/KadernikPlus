import { PrismaClient, Subscription } from ".prisma/client";
import {
  SubscriptionCreateData,
  SubscriptionRepositoryPort,
} from "../../../application/ports/subscription-repository";
import prisma from "./prisma";
import { WithUserId } from "@/entities/user";

const createSubscriptionRepositoryDb = (
  prismaClient: PrismaClient
): SubscriptionRepositoryPort => ({
  add: async (
    data: WithUserId<SubscriptionCreateData>
  ): Promise<Subscription> => {
    const newSub = await prismaClient.subscription.create({
      data: {
        userId: data.userId,
        plan: data.plan,
        status: data.status,
        startDate: "",
        endDate: "",
      },
    });
    return newSub;
  },
  async update(id: string, data: Partial<Subscription>): Promise<Subscription> {
    const sub = await prisma.subscription.update({
      where: { id },
      data,
    });
    return sub;
  },
  findById: async (id) =>
    await prismaClient.subscription.findUnique({ where: { id } }),
  findByUserId: async (userId: string) => {
    const subscription = await prismaClient.subscription.findFirst({
      where: { userId: userId },
    });
    return subscription;
  },
  findActiveByUserId: async (userId: string) =>
    await prismaClient.subscription.findFirst({
      where: { userId, status: "ACTIVE" },
    }),
  cancel: async (id) =>
    await prismaClient.subscription.update({
      where: { id },
      data: { status: "CANCELLED", endDate: new Date() },
    }),
});

const subscriptionRepositoryDb = createSubscriptionRepositoryDb(prisma);

export default subscriptionRepositoryDb;
