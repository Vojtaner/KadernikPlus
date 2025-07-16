// prisma/seed.ts
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Start seeding...");

    // --- Create Users (Hairdressers) ---

    const user1 = await prisma.user.upsert({
      where: { id: "auth0-id-223" },
      update: {},
      create: {
        id: "auth0-id-223",
        name: "John Doe",
        email: "john.doe@example.com",
        authProvider: "auth0",
        createdAt: new Date(),
        lastLogin: new Date(),
      },
    });

    const user2 = await prisma.user.upsert({
      where: { id: "google-oauth2|113238590142888685973" },
      update: {},
      create: {
        id: "google-oauth2|113238590142888685973",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        authProvider: "auth0",
        createdAt: new Date(),
      },
    });
    console.log(`Created users: ${user1.name}, ${user2.name}`);

    // --- Create Clients ---
    const client1 = await prisma.client.upsert({
      where: { phone: "123-456-7890" }, // phone is @unique now
      update: {},
      create: {
        firstName: "Alice",
        lastName: "Johnson",
        phone: "123-456-7890",
        note: "Likes specific color brands.",
        userId: "google-oauth2|113238590142888685973",
      },
    });

    const client2 = await prisma.client.upsert({
      where: { id: "client-2-uuid" }, // <--- FIXED: Using ID for upsert as email is optional and name is not unique
      update: {},
      create: {
        id: "client-2-uuid",
        firstName: "Bob",
        userId: "google-oauth2|113238590142888685973",
        lastName: "Williams",
        phone: "098-765-4321",
        note: "Prefers short, no-fuss haircuts.",
      },
    });
    console.log(`Created clients: ${client1.lastName}, ${client2.lastName}`);

    // --- Create Services ---
    const existingService = await prisma.service.findFirst({
      where: { serviceName: "Haircut" },
    });

    let service1;
    if (existingService) {
      service1 = existingService;
    } else {
      service1 = await prisma.service.create({
        data: {
          serviceName: "Haircut",
          basePrice: 35,
          userId: "google-oauth2|113238590142888685973",
        },
      });
    }

    let service2 = await prisma.service.findFirst({
      where: { serviceName: "Hair Coloring (Full)" },
    });

    if (!service2) {
      service2 = await prisma.service.create({
        data: {
          serviceName: "Hair Coloring (Full)",
          basePrice: 120,
          userId: "google-oauth2|113238590142888685973",
        },
      });
    }

    let service3 = await prisma.service.findFirst({
      where: { serviceName: "Deep Conditioning" },
    });

    if (!service3) {
      service3 = await prisma.service.create({
        data: {
          serviceName: "Deep Conditioning",
          basePrice: 45,
          userId: "auth0-id-223",
        },
      });
    }
    console.log(
      `Created services: ${service1.serviceName}, ${service2.serviceName}, ${service3.serviceName}`
    );

    const stock2 = await prisma.stock.upsert({
      where: { id: "1" },
      update: {},
      create: {
        id: "1",
        ownerId: user2.id,
        stockName: "Stock 1",
      },
    });
    console.log(`Created stock: ${stock2.id}`);

    // --- Create Stock Items ---
    let stockItem1 = await prisma.stockItem.findFirst({
      where: { itemName: "Blonde Dye (Type A)" },
    });

    if (!stockItem1) {
      stockItem1 = await prisma.stockItem.create({
        data: {
          itemName: "Blonde Dye (Type A)",
          unit: "ml",
          stockId: "1",
          price: 22,
          quantity: 500,
          threshold: 100,
          isActive: true,
        },
      });
    }

    let stockItem2 = await prisma.stockItem.findFirst({
      where: { itemName: "Conditioner (Pro)" },
    });

    if (!stockItem2) {
      stockItem2 = await prisma.stockItem.create({
        data: {
          itemName: "Conditioner (Pro)",
          unit: "ml",
          price: 44,
          quantity: 2000,
          stockId: "1",
          threshold: 500,
          isActive: true,
        },
      });
    }

    console.log(
      `Created stock items: ${stockItem1.itemName}, ${stockItem2.itemName}`
    );

    // --- Create Visits (linking users and clients) ---
    const visit1 = await prisma.visit.upsert({
      where: { id: "visit-1-uuid" },
      update: {},
      create: {
        id: "visit-1-uuid",
        clientId: client1.id,
        userId: user1.id,
        deposit: 240,
        depositStatus: "NEZAPLACENO",
        visitStatus: false,
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
        deposit: 240,
        depositStatus: "NEZAPLACENO",
        visitStatus: false,
        userId: user2.id,
        date: new Date("2025-06-21T00:00:00.000Z"),
        note: "Full color change, requires extra dye.",
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
        stockItemId: stockItem1.id,
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
        stockItemId: stockItem2.id,
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
