"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockItemController = exports.userController = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./routes");
// Infrastructure Layer - Data Access (Prisma Adapters)
const prisma_user_repository_1 = require("./infrastructure/data/prisma/prisma-user-repository");
const prisma_stock_item_repository_1 = require("./infrastructure/data/prisma/prisma-stock-item-repository"); // NEW: StockItem Repository
// Application Layer - Use Cases
const add_user_1 = require("./application/use-cases/add-user");
const get_user_by_id_1 = require("./application/use-cases/get-user-by-id");
// NEW: StockItem Use Cases
const add_stock_item_1 = require("./application/use-cases/add-stock-item");
const get_stock_item_by_id_1 = require("./application/use-cases/get-stock-item-by-id");
const find_stock_item_by_name_1 = require("./application/use-cases/find-stock-item-by-name");
const get_all_stock_items_1 = require("./application/use-cases/get-all-stock-items");
// Infrastructure Layer - Controllers (Presentation Adapters)
const user_controller_1 = require("./infrastructure/controllers/user-controller");
const stock_item_controller_1 = require("./infrastructure/controllers/stock-item-controller");
const prisma_1 = __importDefault(require("./infrastructure/data/prisma/prisma"));
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware to parse JSON request bodies
app.use(express_1.default.json());
// --- Dependency Injection Setup ---
// 1. Initialize data access layer (Prisma implementations of repositories)
const prismaUserRepository = new prisma_user_repository_1.PrismaUserRepository(prisma_1.default);
const prismaStockItemRepository = new prisma_stock_item_repository_1.PrismaStockItemRepository(prisma_1.default); // NEW
// 2. Initialize application layer use cases with their dependencies
// User Use Cases
const addUserUseCase = new add_user_1.AddUser(prismaUserRepository);
const getUserByIdUseCase = new get_user_by_id_1.GetUserById(prismaUserRepository);
// Stock Item Use Cases // NEW
const addStockItemUseCase = new add_stock_item_1.AddStockItemUseCase(prismaStockItemRepository);
const getStockItemByIdUseCase = new get_stock_item_by_id_1.GetStockItemByIdUseCase(prismaStockItemRepository);
const findStockItemByNameUseCase = new find_stock_item_by_name_1.FindStockItemByNameUseCase(prismaStockItemRepository);
const getAllStockItemsUseCase = new get_all_stock_items_1.GetAllStockItemsUseCase(prismaStockItemRepository);
// 3. Initialize controllers with their use cases
// User Controller
exports.userController = new user_controller_1.UserController({
    addUser: addUserUseCase,
    getUserById: getUserByIdUseCase,
});
// Stock Item Controller // NEW
exports.stockItemController = new stock_item_controller_1.StockItemController({
    addStockItemUseCase: addStockItemUseCase,
    getStockItemByIdUseCase: getStockItemByIdUseCase,
    findStockItemByNameUseCase: findStockItemByNameUseCase,
    getAllStockItemsUseCase: getAllStockItemsUseCase,
});
// --- API Routes ---
// Basic route to check if the server is running
app.get("/", (req, res) => {
    res.send("Hairdresser App Backend is running!");
});
app.use("/api/users", routes_1.userRoutes);
app.use("/api/clients", routes_1.clientRoutes);
app.use("/api/visits", routes_1.visitRoutes);
app.use("/api/stock-items", routes_1.stockItemRoutes);
// Start the server and connect to the database
const startServer = async () => {
    try {
        await prisma_1.default.$connect(); // Connect Prisma Client to the database
        console.log("Connected to the database successfully!");
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to connect to the database or start server:", error);
        process.exit(1);
    }
};
// Start the server
startServer();
// Graceful shutdown: Disconnect Prisma when the Node.js process is about to exit.
process.on("beforeExit", async () => {
    await prisma_1.default.$disconnect();
    console.log("Disconnected from the database.");
});
