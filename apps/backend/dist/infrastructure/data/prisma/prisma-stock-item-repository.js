"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require(".prisma/client");
const prisma_1 = __importDefault(require("./prisma"));
const stock_item_controller_1 = require("../../../infrastructure/controllers/stock-item-controller");
const library_1 = require("@prisma/client/runtime/library");
const team_member_1 = require("../../../entities/team-member");
const stock_item_errors_1 = __importDefault(require("../../../domain/errors/stock-item-errors"));
const createStockItemRepositoryDb = (prismaStockRepository) => {
    return {
        createOrUpdateStockItem: async (data) => {
            try {
                const getAvgPrice = (price, quantity) => new library_1.Decimal((price / quantity).toFixed(2));
                const isPurchase = (0, stock_item_controller_1.isPurchaseStockItem)(data);
                if (isPurchase) {
                    const { id, price, quantity } = data;
                    const existing = await prismaStockRepository.stockItem.findFirst({
                        where: { id },
                    });
                    const newQty = Number(quantity);
                    const newPrice = Number(price);
                    const avgPrice = getAvgPrice(newPrice, newQty);
                    const totalQty = Number(existing?.quantity ?? 0) + newQty;
                    if (existing) {
                        return await prismaStockRepository.stockItem.update({
                            where: { id },
                            data: {
                                quantity: new client_1.Prisma.Decimal(totalQty),
                                price: new client_1.Prisma.Decimal(avgPrice),
                            },
                        });
                    }
                    return; // If purchasing but item not found
                }
                if (data.id) {
                    const { id, itemName, quantity, price, threshold, unit, stockId } = data;
                    const avgPrice = getAvgPrice(Number(price), Number(quantity));
                    return await prisma_1.default.stockItem.update({
                        where: { id },
                        data: {
                            itemName,
                            quantity: new client_1.Prisma.Decimal(quantity),
                            price: new client_1.Prisma.Decimal(avgPrice),
                            threshold: new client_1.Prisma.Decimal(threshold),
                            unit,
                            stockId,
                        },
                    });
                }
                const { itemName, unit, quantity, threshold, price, stockId } = data;
                const avgPrice = getAvgPrice(Number(price), Number(quantity));
                return await prismaStockRepository.stockItem.create({
                    data: {
                        itemName,
                        unit,
                        quantity: new client_1.Prisma.Decimal(quantity),
                        price: new client_1.Prisma.Decimal(avgPrice),
                        threshold: new client_1.Prisma.Decimal(threshold),
                        isActive: true,
                        stock: { connect: { id: stockId } },
                    },
                });
            }
            catch (err) {
                if (err instanceof library_1.PrismaClientKnownRequestError &&
                    err.code === "P2002") {
                    throw (0, stock_item_errors_1.default)();
                }
                throw err;
            }
        },
        deleteStockItem: async (id, userId) => {
            const teamMember = await prismaStockRepository.teamMember.findFirst({
                where: { userId },
            });
            const stockItem = await prismaStockRepository.stockItem.findUnique({
                where: { id },
                include: { stock: true },
            });
            if (!stockItem) {
                throw new Error("Položka skladu nebyla nalezena.");
            }
            const isOwnStock = stockItem.stock.teamId === team_member_1.DEFAULT_USERS_TEAM &&
                stockItem.stock.ownerId === userId;
            const isTeamStock = stockItem.stock.teamId === teamMember?.teamId &&
                teamMember?.canAccessStocks;
            if (!isOwnStock && !isTeamStock) {
                throw new Error("Nemáte oprávnění k odstranění této položky skladu.");
            }
            await prismaStockRepository.stockItem.update({
                where: { id },
                data: { isActive: false },
            });
        },
        getStockItemById: async (stockItemId, userId) => {
            const teamMember = await prismaStockRepository.teamMember.findFirst({
                where: { userId },
            });
            const stockItem = await prismaStockRepository.stockItem.findUnique({
                where: { id: stockItemId, isActive: true },
                include: { stock: true },
            });
            if (!stockItem) {
                throw new Error("Položka skladu nebyla nalezena.");
            }
            const isOwnStock = stockItem.stock.teamId === team_member_1.DEFAULT_USERS_TEAM &&
                stockItem.stock.ownerId === userId;
            const isTeamStock = stockItem.stock.teamId === teamMember?.teamId &&
                teamMember?.canAccessStocks;
            if (isOwnStock || isTeamStock) {
                return stockItem;
            }
            throw new Error("Nemáte oprávnění k přístupu k této položce skladu.");
        },
        findStockItemByName: async (itemName) => {
            //tady ten endpoint asi nebude potřeba
            const stockItem = await prismaStockRepository.stockItem.findFirst({
                where: { itemName: itemName },
            });
            return stockItem ?? null;
        },
        getStockItemsByStockId: async (stockId, userId) => {
            const teamMember = await prisma_1.default.teamMember.findUnique({
                where: { userId },
            });
            if (teamMember?.canAccessStocks) {
                const stockIds = await prismaStockRepository.stock
                    .findMany({
                    where: { teamId: teamMember?.teamId },
                })
                    .then((stocks) => {
                    return stocks
                        .map((stock) => stock.id)
                        .filter((stock) => stock !== null);
                });
                if (stockIds.length === 0) {
                    throw new Error("Žádné zásoby nenalezeny.");
                }
                const stockItems = await prismaStockRepository.stockItem.findMany({
                    where: { stockId: { in: stockIds }, isActive: true },
                });
                return stockItems;
            }
            else {
                const stock = await prismaStockRepository.stock.findFirst({
                    where: { ownerId: teamMember?.userId },
                });
                const stockItems = await prismaStockRepository.stockItem.findMany({
                    where: { stockId: stock?.id, isActive: true },
                });
                return stockItems;
            }
        },
    };
};
const stockItemRepositoryDb = createStockItemRepositoryDb(prisma_1.default);
exports.default = stockItemRepositoryDb;
