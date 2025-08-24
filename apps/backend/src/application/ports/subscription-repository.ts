import { Subscription } from ".prisma/client";

export type SubscriptionCreateData = {
  userId: string;
  plan: SubscriptionPlans;
  startDate?: Date;
  status: SubscriptionStates;
  endDate?: Date | null;
  currency: "CZK";
  price: number;
};

export type SubscriptionPlans = "pro";
export type SubscriptionStates = "ACTIVE" | "CANCELLED" | "EXPIRED" | "PENDING";

export type SubscriptionRepositoryPort = {
  add(data: SubscriptionCreateData): Promise<Subscription>;
  findById(id: string): Promise<Subscription | null>;
  findByUserId(userId: string): Promise<Subscription | null>;
  findActiveByUserId(userId: string): Promise<Subscription | null>;
  cancel(id: string): Promise<Subscription>;
  update(id: string, data: Partial<Subscription>): Promise<Subscription>;
};
