"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="60679a39-d339-525f-9002-3ea755d97b7b")}catch(e){}}();

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
const httpError_1 = require("../../../adapters/express/httpError");
const createStockItemRepositoryDb = (prismaStockRepository) => {
    return {
        createOrUpdateStockItem: async (data) => {
            try {
                const isPurchase = (0, stock_item_controller_1.isPurchaseStockItem)(data);
                if (isPurchase) {
                    const { id, totalPrice, quantity, packageCount } = data;
                    const existing = await prismaStockRepository.stockItem.findFirst({
                        where: { id },
                    });
                    if (!existing) {
                        throw (0, httpError_1.httpError)("Nepodařilo se najít položku na skladu.", 404);
                    }
                    const newQuantityPerPiece = Number(quantity);
                    const newTotalPrice = Number(totalPrice);
                    const newPackageCount = Number(packageCount);
                    const newTotalQuantity = newQuantityPerPiece * newPackageCount;
                    const updatedQuantity = newTotalQuantity + Number(existing.quantity);
                    const updatedTotalPrice = newTotalPrice + Number(existing.totalPrice);
                    const updatedPackageCount = newPackageCount + Number(existing.packageCount);
                    const updatedAvgPrice = updatedQuantity > 0 ? updatedTotalPrice / updatedQuantity : 0;
                    if (existing) {
                        return await prismaStockRepository.stockItem.update({
                            where: { id },
                            data: {
                                quantity: new client_1.Prisma.Decimal(updatedQuantity),
                                totalPrice: new client_1.Prisma.Decimal(updatedTotalPrice),
                                avgUnitPrice: new client_1.Prisma.Decimal(updatedAvgPrice),
                                packageCount: new client_1.Prisma.Decimal(updatedPackageCount),
                                lastPackageQuantity: new client_1.Prisma.Decimal(quantity),
                            },
                        });
                    }
                    return;
                }
                if (data.id) {
                    const { id, itemName, quantity, totalPrice, threshold, unit, stockId, packageCount, } = data;
                    const updatedQuantity = packageCount * quantity;
                    const avgPrice = updatedQuantity > 0 ? totalPrice / updatedQuantity : 0;
                    return await prisma_1.default.stockItem.update({
                        where: { id },
                        data: {
                            itemName,
                            quantity: new client_1.Prisma.Decimal(updatedQuantity),
                            totalPrice: new client_1.Prisma.Decimal(totalPrice),
                            avgUnitPrice: new client_1.Prisma.Decimal(avgPrice),
                            threshold: new client_1.Prisma.Decimal(threshold),
                            packageCount: new client_1.Prisma.Decimal(packageCount),
                            lastPackageQuantity: new client_1.Prisma.Decimal(quantity),
                            unit,
                            stockId,
                        },
                    });
                }
                const { itemName, unit, quantity, threshold, totalPrice, stockId, packageCount, } = data;
                const updatedQuantity = packageCount * quantity;
                const avgPrice = updatedQuantity > 0 ? totalPrice / updatedQuantity : 0;
                const itemNameAlreadyExists = await prisma_1.default.stockItem.findUnique({
                    where: {
                        stockId_itemName_isActive: {
                            stockId: data.stockId,
                            itemName: data.itemName,
                            isActive: true,
                        },
                    },
                });
                if (itemNameAlreadyExists) {
                    throw (0, httpError_1.httpError)("Položka na vašem skladu už existuje.", 409);
                }
                return await prismaStockRepository.stockItem.create({
                    data: {
                        itemName,
                        unit,
                        quantity: new client_1.Prisma.Decimal(updatedQuantity),
                        totalPrice: new client_1.Prisma.Decimal(totalPrice),
                        avgUnitPrice: new client_1.Prisma.Decimal(avgPrice),
                        threshold: new client_1.Prisma.Decimal(threshold),
                        isActive: true,
                        packageCount: new client_1.Prisma.Decimal(packageCount),
                        lastPackageQuantity: new client_1.Prisma.Decimal(quantity),
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
            const stockItem = await prismaStockRepository.stockItem.findFirst({
                where: { itemName: itemName },
            });
            return stockItem ?? null;
        },
        getStockItemsByStockId: async (stockId, userId) => {
            const teamMember = await prisma_1.default.teamMember.findUnique({
                where: { userId },
            });
            if (!teamMember) {
                throw new Error("Nejste součástí žádného týmu.");
            }
            console.log({ userId });
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
//# sourceMappingURL=prisma-stock-item-repository.js.map
//# debugId=60679a39-d339-525f-9002-3ea755d97b7b
