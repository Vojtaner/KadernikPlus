import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "./generated/prisma"; // Adjusted import path for custom output

// Infrastructure Layer - Data Access (Prisma Adapters)
import { PrismaUserRepository } from "./infrastructure/data/prisma/prisma-user-repository";
import { PrismaClientRepository } from "./infrastructure/data/prisma/prisma-client-repository"; // NEW: Client Repository
import { PrismaVisitRepository } from "./infrastructure/data/prisma/prisma-visit-repository"; // NEW: Visit Repository

// Application Layer - Use Cases
import { AddUser } from "./application/use-cases/add-user";
import { GetUserById } from "./application/use-cases/get-user-by-id";
import { AddClient } from "./application/use-cases/add-client"; // NEW: Add Client Use Case
import { GetClientById } from "./application/use-cases/get-client-by-id"; // NEW: Get Client By ID Use Case
import { AddVisit } from "./application/use-cases/add-visit"; // NEW: Add Visit Use Case
import { GetVisits } from "./application/use-cases/get-visits"; // NEW: Get Visits Use Case

// Infrastructure Layer - Controllers (Presentation Adapters)
import { UserController } from "./infrastructure/controllers/user-controller";
import { ClientController } from "./infrastructure/controllers/client-controller"; // NEW: Client Controller
import { VisitController } from "./infrastructure/controllers/visit-controller"; // NEW: Visit Controller
import { makeExpressCallback } from "./utils/make-express-callback";

// Frameworks Layer - Express Utilities

// Load environment variables from .env file
dotenv.config();

// Initialize Prisma Client
// This client instance will be shared across your application.
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// --- Dependency Injection Setup ---
// 1. Initialize data access layer (Prisma implementations of repositories)
const prismaUserRepository = new PrismaUserRepository(prisma);
const prismaClientRepository = new PrismaClientRepository(prisma); // NEW
const prismaVisitRepository = new PrismaVisitRepository(prisma); // NEW

// 2. Initialize application layer use cases with their dependencies
// User Use Cases
const addUserUseCase = new AddUser(prismaUserRepository);
const getUserByIdUseCase = new GetUserById(prismaUserRepository);

// Client Use Cases
const addClientUseCase = new AddClient(prismaClientRepository); // NEW
const getClientByIdUseCase = new GetClientById(prismaClientRepository); // NEW

// Visit Use Cases (Note: AddVisit and GetVisits depend on User and Client repos for validation)
const addVisitUseCase = new AddVisit(
  prismaVisitRepository,
  prismaUserRepository,
  prismaClientRepository,
); // NEW
const getVisitsUseCase = new GetVisits(
  prismaVisitRepository,
  prismaClientRepository,
); // NEW

// 3. Initialize controllers with their use cases
// User Controller
const userController = new UserController({
  addUser: addUserUseCase,
  getUserById: getUserByIdUseCase,
});

// Client Controller // NEW
const clientController = new ClientController({
  addClient: addClientUseCase,
  getClientById: getClientByIdUseCase,
});

// Visit Controller // NEW
const visitController = new VisitController({
  addVisit: addVisitUseCase,
  getVisits: getVisitsUseCase,
});

// --- API Routes ---

// Basic route to check if the server is running
app.get("/", (req, res) => {
  res.send("Hairdresser App Backend is running!"); // Updated message
});

// User routes
app.post("/api/users", makeExpressCallback(userController.addUserController));
app.get(
  "/api/users/:id",
  makeExpressCallback(userController.getUserByIdController),
);

// Client routes // NEW
app.post(
  "/api/clients",
  makeExpressCallback(clientController.addClientController),
);
app.get(
  "/api/clients/:id",
  makeExpressCallback(clientController.getClientByIdController),
);

// Visit routes // NEW
app.post(
  "/api/visits",
  makeExpressCallback(visitController.addVisitController),
);
app.get(
  "/api/visits",
  makeExpressCallback(visitController.getVisitsController),
); // For all visits or filtered by clientId query param

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
