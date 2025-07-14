// prisma/seed.ts
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Start seeding...");

    // --- Create Users (Hairdressers) ---
    const hashedPassword1 = await bcrypt.hash("password123", 10);
    const hashedPassword2 = await bcrypt.hash("securepass", 10);

    const user1 = await prisma.user.upsert({
      where: { email: "john.doe@example.com" }, // email is @unique now
      update: {},
      create: {
        name: "John Doe",
        email: "john.doe@example.com",
        passwordHash: hashedPassword1,
        authProvider: "email/password",
        createdAt: new Date(),
        lastLogin: new Date(),
      },
    });

    const user2 = await prisma.user.upsert({
      where: { email: "jane.smith@example.com" }, // email is @unique now
      update: {},
      create: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        passwordHash: hashedPassword2,
        authProvider: "email/password",
        createdAt: new Date(),
      },
    });
    console.log(`Created users: ${user1.name}, ${user2.name}`);

    // --- Create Clients ---
    const client1 = await prisma.client.upsert({
      where: { phone: "alice.customer@example.com" }, // phone is @unique now
      update: {},
      create: {
        firstName: "Alice",
        lastName: "Johnson",
        phone: "123-456-7890",
        note: "Likes specific color brands.",
      },
    });

    const client2 = await prisma.client.upsert({
      where: { id: "client-2-uuid" }, // <--- FIXED: Using ID for upsert as email is optional and name is not unique
      update: {},
      create: {
        id: "client-2-uuid",
        firstName: "Bob",
        lastName: "Williams",
        phone: "098-765-4321",
        note: "Prefers short, no-fuss haircuts.",
      },
    });
    console.log(`Created clients: ${client1.lastName}, ${client2.lastName}`);

    // --- Create Services ---
    const service1 = await prisma.service.upsert({
      where: { name: "Haircut" },
      update: {},
      create: { name: "Haircut", basePrice: 35 },
    });

    const service2 = await prisma.service.upsert({
      where: { name: "Hair Coloring (Full)" },
      update: {},
      create: { name: "Hair Coloring (Full)", basePrice: 120 },
    });

    const service3 = await prisma.service.upsert({
      where: { name: "Deep Conditioning" },
      update: {},
      create: { name: "Deep Conditioning", basePrice: 45 },
    });
    console.log(
      `Created services: ${service1.name}, ${service2.name}, ${service3.name}`
    );

    // --- Create Stock Items ---
    const stockItem1 = await prisma.stockItem.upsert({
      where: { name: "Blonde Dye (Type A)" },
      update: {},
      create: {
        name: "Blonde Dye (Type A)",
        unit: "ml",
        quantity: 500,
        threshold: 100,
        isActive: true,
      },
    });

    const stockItem2 = await prisma.stockItem.upsert({
      where: { name: "Conditioner (Pro)" },
      update: {},
      create: {
        name: "Conditioner (Pro)",
        unit: "ml",
        quantity: 2000,
        threshold: 500,
        isActive: true,
      },
    });
    console.log(`Created stock items: ${stockItem1.name}, ${stockItem2.name}`);

    // --- Create Visits (linking users and clients) ---
    const visit1 = await prisma.visit.upsert({
      where: { id: "visit-1-uuid" },
      update: {},
      create: {
        id: "visit-1-uuid",
        clientId: client1.id,
        userId: user1.id,
        date: new Date("2025-06-20T00:00:00.000Z"),
        note: "Standard haircut and styling.",
        paidPrice: 35,
      },
    });

    const visit2 = await prisma.visit.upsert({
      where: { id: "visit-2-uuid" },
      update: {},
      create: {
        id: "visit-2-uuid",
        clientId: client2.id,
        userId: user2.id,
        date: new Date("2025-06-21T00:00:00.000Z"),
        note: "Full color change, requires extra dye.",
        paidPrice: 120,
      },
    });
    console.log(`Created visits: ${visit1.id}, ${visit2.id}`);

    // --- Create Visit Services (linking visits and services) ---
    const visitService1 = await prisma.visitService.upsert({
      where: {
        visitId_serviceId: { visitId: visit1.id, serviceId: service1.id },
      },
      update: {},
      create: {
        visitId: visit1.id,
        serviceId: service1.id,
        minutesPerformed: 45,
      },
    });

    const visitService2 = await prisma.visitService.upsert({
      where: {
        visitId_serviceId: { visitId: visit2.id, serviceId: service2.id },
      },
      update: {},
      create: {
        visitId: visit2.id,
        serviceId: service2.id,
        minutesPerformed: 180,
      },
    });
    console.log(
      `Created visit services: ${visitService1.id}, ${visitService2.id}`
    );

    // --- Create Procedures (linking to visits) ---
    const procedure1 = await prisma.procedure.upsert({
      where: { id: "proc-1-uuid" },
      update: {},
      create: {
        id: "proc-1-uuid",
        visitId: visit2.id,
        stepOrder: 1,
        description: "Applied full blonde dye mix.",
        gramsUsed: 150.0,
        timeMinutes: 90,
        issue: null,
      },
    });

    const procedure2 = await prisma.procedure.upsert({
      where: { id: "proc-2-uuid" },
      update: {},
      create: {
        id: "proc-2-uuid",
        visitId: visit1.id,
        stepOrder: 1,
        description: "Basic cut and wash.",
        gramsUsed: null,
        timeMinutes: 30,
        issue: null,
      },
    });
    console.log(`Created procedures: ${procedure1.id}, ${procedure2.id}`);

    // --- Create Stock Allowances (linking to users, stock items, and optionally procedures) ---
    const stockAllowance1 = await prisma.stockAllowance.upsert({
      where: { id: "sa-1-uuid" },
      update: {},
      create: {
        id: "sa-1-uuid",
        userId: user1.id,
        stockId: stockItem1.id,
        // <--- FIXED: Use `connect` for the relationship, not `procedureId` scalar field
        procedure: {
          connect: { id: procedure1.id },
        },
        quantity: 150.0,
      },
    });

    const stockAllowance2 = await prisma.stockAllowance.upsert({
      where: { id: "sa-2-uuid" },
      update: {},
      create: {
        id: "sa-2-uuid",
        userId: user2.id,
        stockId: stockItem2.id,
        // No procedure for this allowance, so simply omit the 'procedure' field
        quantity: 50.0,
      },
    });
    console.log(
      `Created stock allowances: ${stockAllowance1.id}, ${stockAllowance2.id}`
    );

    // --- Create Photos (linking to visits) ---
    const photo1 = await prisma.photo.upsert({
      where: { id: "photo-1-uuid" },
      update: {},
      create: {
        id: "photo-1-uuid",
        visitId: visit2.id,
        url: "https://example.com/photos/visit2_before.jpg",
        description: "Client hair before coloring.",
      },
    });

    const photo2 = await prisma.photo.upsert({
      where: { id: "photo-2-uuid" },
      update: {},
      create: {
        id: "photo-2-uuid",
        visitId: visit2.id,
        url: "https://example.com/photos/visit2_after.jpg",
        description: "Client hair after coloring.",
      },
    });
    console.log(`Created photos: ${photo1.id}, ${photo2.id}`);

    console.log("Seeding finished.");
  } catch (e: any) {
    console.error("Error during seeding:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
