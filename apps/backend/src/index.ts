import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables from .env file
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('Order App Backend is running!');
});

// --- Database Connection Test Route (Temporary for setup verification) ---
app.get('/test-db', async (req, res) => {
  try {
    // Attempt to connect to the database and perform a simple query
    await prisma.$connect();
    // Perform a simple read query (e.g., count users)
    const userCount = await prisma.user.count();
    res.status(200).json({ message: 'Database connection successful!', userCount });
  } catch (error: any) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  } finally {
    // It's good practice to disconnect in a specific test route like this,
    // but typically you keep the client connected for the app's lifetime.
    await prisma.$disconnect();
  }
});
// --- End of Temporary DB Test Route ---


// Start the server and connect to the database
const startServer = async () => {
  try {
    await prisma.$connect(); // Connect Prisma Client to the database
    console.log('Connected to the database successfully!');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database or start server:', error);
    process.exit(1); // Exit the process if unable to connect or start
  }
};

// Start the server
startServer();

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect(); // Disconnect Prisma Client before exiting
  console.log('Disconnected from the database.');
});