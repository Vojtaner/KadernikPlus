import express from "express";
import dotenv from "dotenv";

// Infrastructure Layer - Data Access (Prisma Adapters)
import { PrismaUserRepository } from "./infrastructure/data/prisma/prisma-user-repository";
import { PrismaClientRepository } from "./infrastructure/data/prisma/prisma-client-repository";
// import { PrismaVisitRepository } from "./infrastructure/data/prisma/prisma-visit-repository";
import { PrismaStockItemRepository } from "./infrastructure/data/prisma/prisma-stock-item-repository"; // NEW: StockItem Repository

// Application Layer - Use Cases
import { AddUser } from "./application/use-cases/add-user";
import { GetUserById } from "./application/use-cases/get-user-by-id";
import { AddClient } from "./application/use-cases/add-client";
import { GetClientById } from "./application/use-cases/get-client-by-id";
import {
  AddVisit,
  // createAddVisitUseCase,
} from "./application/use-cases/add-visit";
import { GetVisits } from "./application/use-cases/get-visits";
// NEW: StockItem Use Cases
import { AddStockItemUseCase } from "./application/use-cases/add-stock-item";
import { GetStockItemByIdUseCase } from "./application/use-cases/get-stock-item-by-id";
import { FindStockItemByNameUseCase } from "./application/use-cases/find-stock-item-by-name";
import { GetAllStockItemsUseCase } from "./application/use-cases/get-all-stock-items";

// Infrastructure Layer - Controllers (Presentation Adapters)
import { UserController } from "./infrastructure/controllers/user-controller";
import { ClientController } from "./infrastructure/controllers/client-controller";
import { StockItemController } from "./infrastructure/controllers/stock-item-controller";
import VisitController from "./infrastructure/controllers/visit-controller";
import { makeExpressCallback } from "./utils/make-express-callback";
import { PrismaClient } from "@prisma/client";
// import {
//   createVisitController,
//   VisitController,
// } from "./infrastructure/controllers/visit-controller";
// import { makeExpressCallback } from "./utils/make-express-callback";
// import { PrismaClient } from "./generated/prisma/client";
import stockItemRoutes from "./routes/stock-item-routes";
import userRoutes from "./routes/user-routes";
import visitRoutes from "./routes/visit-routes";
import prisma from "./infrastructure/data/prisma/prisma";
import clientRoutes from "./routes/client-routes";

// Load environment variables from .env file
dotenv.config();

// Initialize Prisma Client
// const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// --- Dependency Injection Setup ---
// 1. Initialize data access layer (Prisma implementations of repositories)
const prismaUserRepository = new PrismaUserRepository(prisma);
const prismaClientRepository = new PrismaClientRepository(prisma);
// const prismaVisitRepository = new PrismaVisitRepository(prisma);
const prismaStockItemRepository = new PrismaStockItemRepository(prisma); // NEW

// 2. Initialize application layer use cases with their dependencies
// User Use Cases
const addUserUseCase = new AddUser(prismaUserRepository);
const getUserByIdUseCase = new GetUserById(prismaUserRepository);

// Client Use Cases
const addClientUseCase = new AddClient(prismaClientRepository);
const getClientByIdUseCase = new GetClientById(prismaClientRepository);

// Visit Use Cases
// const addVisitUseCase = new AddVisit(
//   prismaVisitRepository,
//   prismaUserRepository,
//   prismaClientRepository
// );

// const getVisitsUseCase = new GetVisits(
//   prismaVisitRepository,
//   prismaClientRepository
// );

// Stock Item Use Cases // NEW
const addStockItemUseCase = new AddStockItemUseCase(prismaStockItemRepository);
const getStockItemByIdUseCase = new GetStockItemByIdUseCase(
  prismaStockItemRepository
);
const findStockItemByNameUseCase = new FindStockItemByNameUseCase(
  prismaStockItemRepository
);
const getAllStockItemsUseCase = new GetAllStockItemsUseCase(
  prismaStockItemRepository
);

// 3. Initialize controllers with their use cases
// User Controller
export const userController = new UserController({
  addUser: addUserUseCase,
  getUserById: getUserByIdUseCase,
});

// Client Controller
export const clientController = new ClientController({
  addClient: addClientUseCase,
  getClientById: getClientByIdUseCase,
});

// Visit Controller
// const visitController = new VisitController({
//   addVisit: addVisitUseCase,
//   getVisits: getVisitsUseCase,
// });

// const visitControllerFn = createVisitController({
//   addVisit: addVisitUseCaseFn,
//   //get visit dodělat je jen pro úplnost
//   getVisits: getVisitsUseCase,
// });

// Stock Item Controller // NEW
export const stockItemController = new StockItemController({
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

app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/stock-items", stockItemRoutes);

// Start the server and connect to the database
const startServer = async () => {
  try {
    await prisma.$connect(); // Connect Prisma Client to the database
    console.log("Connected to the database successfully!");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database or start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Graceful shutdown: Disconnect Prisma when the Node.js process is about to exit.
process.on("beforeExit", async () => {
  await prisma.$disconnect();
  console.log("Disconnected from the database.");
});
