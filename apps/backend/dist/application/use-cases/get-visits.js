"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const add_visit_1 = require("./add-visit");
const prisma_visit_repository_1 = __importDefault(require("../../infrastructure/data/prisma/prisma-visit-repository"));
const prisma_client_repository_1 = __importDefault(require("../../infrastructure/data/prisma/prisma-client-repository"));
/**
 * Use case to retrieve visits from the system.
 * Can retrieve all visits or filter by a specific client ID.
 */
// export class GetVisits {
//   private readonly visitRepository: VisitRepository;
//   private readonly clientRepository: ClientRepository; // For validation
//   /**
//    * @param visitRepository An implementation of the VisitRepository interface.
//    * @param clientRepository An implementation of the ClientRepository interface (for validation).
//    */
//   constructor(
//     visitRepository: VisitRepository,
//     clientRepository: ClientRepository
//   ) {
//     this.visitRepository = visitRepository;
//     this.clientRepository = clientRepository;
//   }
//   /**
//    * Executes the use case to get visits.
//    * @param clientId (Optional) If provided, retrieves visits only for this client.
//    * @returns A Promise that resolves to an array of Visit entities.
//    * @throws ClientNotFoundError if a clientId is provided but no such client exists.
//    */
//   async execute(clientId?: string): Promise<Visit[]> {
//     // If filtering by client ID, first ensure the client exists.
//     if (clientId) {
//       const clientExists = await this.clientRepository.findById(clientId);
//       if (!clientExists) {
//         throw new ClientNotFoundError(clientId);
//       }
//     }
//     const visits = await this.visitRepository.findAll(clientId);
//     return visits;
//   }
// }
const createGetVisitsUseCase = (dependencies) => {
    return {
        execute: async (clientId) => {
            if (clientId) {
                const clientExists = await dependencies.clientRepositoryDb.findById(clientId);
                if (!clientExists) {
                    throw (0, add_visit_1.ClientNotFoundError)(clientId);
                }
            }
            const visits = await dependencies.visitRepositoryDb.findAll(clientId);
            return visits;
        },
    };
};
const getVisitsUseCase = createGetVisitsUseCase({
    visitRepositoryDb: prisma_visit_repository_1.default,
    clientRepositoryDb: prisma_client_repository_1.default,
});
exports.default = getVisitsUseCase;
