// import { PrismaClient, DepositStatus } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   // Create a User
//   const user = await prisma.user.upsert({
//     where: { email: "hairdresser@example.com" },
//     update: {},
//     create: {
//       name: "Jan Novák",
//       email: "hairdresser@example.com",
//       bankAccount: "1234567890/0800",
//       authProvider: "google",
//     },
//   });

//   // Create a Team
//   const team = await prisma.team.create({
//     data: {
//       name: "KadernikPlus Team",
//     },
//   });

//   // Add user to team with permissions
//   await prisma.teamMember.create({
//     data: {
//       teamId: team.id,
//       userId: user.id,
//       canAccessStocks: true,
//       canAccessClients: true,
//       canAccessVisits: true,
//     },
//   });

//   // Create a Stock owned by user and team
//   const stock = await prisma.stock.create({
//     data: {
//       stockName: "Hlavní sklad",
//       ownerId: user.id,
//       teamId: team.id,
//     },
//   });

//   // Add StockItems
//   const peroxide = await prisma.stockItem.create({
//     data: {
//       itemName: "Peroxid",
//       unit: "ml",
//       quantity: 500,
//       price: 120, // price per unit (e.g. per ml)
//       threshold: 20,
//       stockId: stock.id,
//     },
//   });

//   const blondor = await prisma.stockItem.create({
//     data: {
//       itemName: "Blondor",
//       unit: "g",
//       quantity: 200,
//       price: 200,
//       threshold: 10,
//       stockId: stock.id,
//     },
//   });

//   // Create a Client
//   const client = await prisma.client.create({
//     data: {
//       firstName: "Petra",
//       lastName: "Svobodová",
//       phone: "777123456",
//       deposit: true,
//       note: "Pravidelná zákaznice",
//       userId: user.id,
//       teamId: team.id,
//     },
//   });

//   // Create a Service
//   const service = await prisma.service.create({
//     data: {
//       serviceName: "Barvení vlasů",
//       basePrice: 1500,
//       userId: user.id,
//       teamId: team.id,
//     },
//   });

//   // Create a Visit
//   const visit = await prisma.visit.create({
//     data: {
//       clientId: client.id,
//       userId: user.id,
//       date: new Date(),
//       note: "Barvení na blond",
//       deposit: 500,
//       depositStatus: DepositStatus.ZAPLACENO,
//       visitStatus: true,
//       paidPrice: 1500,
//       teamId: team.id,
//     },
//   });

//   // Create a Procedure for the Visit
//   const procedure = await prisma.procedure.create({
//     data: {
//       visitId: visit.id,
//       stepOrder: 1,
//       description: "Nanesení peroxidu",
//     },
//   });

//   // Create StockAllowance for Procedure
//   await prisma.stockAllowance.create({
//     data: {
//       userId: user.id,
//       stockItemId: peroxide.id,
//       procedureId: procedure.id,
//       quantity: 30,
//     },
//   });

//   // Link the Service to the Visit via VisitService
//   await prisma.visitService.create({
//     data: {
//       visitId: visit.id,
//       serviceId: service.id,
//     },
//   });

//   console.log("✅ Seed data created!");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
