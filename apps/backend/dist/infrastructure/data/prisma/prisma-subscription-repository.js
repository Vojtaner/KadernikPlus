"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="bd6363a2-e3e8-5498-97ef-73ae20f99994")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./prisma"));
const dayjs_1 = __importDefault(require("dayjs"));
const createSubscriptionRepositoryDb = (prismaClient) => ({
    add: async (data) => {
        const newSub = await prismaClient.subscription.create({
            data: {
                userId: data.userId,
                plan: data.plan,
                status: data.status,
                endDate: (0, dayjs_1.default)().add(10, "days").toISOString(),
            },
        });
        return newSub;
    },
    async update(id, data) {
        console.log({ data, id });
        const sub = await prisma_1.default.subscription.update({
            where: { id },
            data,
        });
        return sub;
    },
    findById: async (id) => await prismaClient.subscription.findUnique({ where: { id } }),
    findByUserId: async (userId) => {
        const subscription = await prismaClient.subscription.findFirst({
            where: { userId: userId },
        });
        return subscription;
    },
    findActiveByUserId: async (userId) => await prismaClient.subscription.findFirst({
        where: { userId, status: "ACTIVE" },
    }),
    cancel: async (id) => await prismaClient.subscription.update({
        where: { id },
        data: { status: "CANCELLED", endDate: new Date() },
    }),
});
const subscriptionRepositoryDb = createSubscriptionRepositoryDb(prisma_1.default);
exports.default = subscriptionRepositoryDb;
//# sourceMappingURL=prisma-subscription-repository.js.map
//# debugId=bd6363a2-e3e8-5498-97ef-73ae20f99994
