import express from "express";
import dotenv from "dotenv";
import {
  clientRoutes,
  userRoutes,
  visitRoutes,
  stockItemRoutes,
} from "./routes";
import prisma from "./infrastructure/data/prisma/prisma";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import errorHandler from "./utils/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const jwtCheck = auth({
  audience: "http://localhost:3021",
  issuerBaseURL: "https://dev-ri7i8tb9.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hairdresser App Backend is running!");
});

app.use(jwtCheck);
app.use("/api/visits", visitRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/stock-items", stockItemRoutes);
app.use(errorHandler);

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully!");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database or start server:", error);
    process.exit(1);
  }
};

startServer();

process.on("beforeExit", async () => {
  await prisma.$disconnect();
  console.log("Disconnected from the database.");
});
