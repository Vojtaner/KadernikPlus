// src/index.ts
import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "./generated/prisma"; // Adjusted import path for custom output

// Infrastructure Layer - Data Access (Prisma Adapter)
import { PrismaUserRepository } from "./infrastructure/data/prisma/prisma-user-repository";

// Application Layer - Use Cases
import { AddUser } from "./application/use-cases/add-user";
import { GetUserById } from "./application/use-cases/get-user-by-id";

// Infrastructure Layer - Controllers (Presentation Adapter)
import { UserController } from "./infrastructure/controllers/user-controller";
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
// 1. Initialize data access layer (Prisma implementation of repository)
const prismaUserRepository = new PrismaUserRepository(prisma);

// 2. Initialize application layer use cases with their dependencies
const addUserUseCase = new AddUser(prismaUserRepository);
const getUserByIdUseCase = new GetUserById(prismaUserRepository);

// 3. Initialize controllers with their use cases
const userController = new UserController({
  addUser: addUserUseCase,
  getUserById: getUserByIdUseCase,
});

// --- API Routes ---

// Basic route to check if the server is running
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// User routes
// POST /api/users - To create a new user
app.post("/api/users", makeExpressCallback(userController.addUserController));

// GET /api/users/:id - To get a user by ID
app.get(
  "/api/users/:id",
  makeExpressCallback(userController.getUserByIdController),
);

// --- Removed: Database Connection Test Route (Temporary for setup verification) ---
// This route was for initial setup validation and is no longer needed in the main app.
// If you still need a health check, consider a simpler one that doesn't disconnect/reconnect.

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
    // It's crucial to exit if the database connection fails at startup for a robust app.
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
