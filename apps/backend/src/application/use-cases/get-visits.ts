import { Visit } from "@/entities/visit";
import {
  VisitRepository,
  VisitRepositoryPort,
} from "@/application/ports/visit-repository";
import {
  ClientRepository,
  ClientRepositoryPort,
} from "@/application/ports/client-repository";
import { ClientNotFoundError } from "./add-visit";
import visitRepositoryDb from "../../infrastructure/data/prisma/prisma-visit-repository";
import clientRepositoryDb from "../../infrastructure/data/prisma/prisma-client-repository";
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

const createGetVisitsUseCase = (dependencies: {
  visitRepositoryDb: VisitRepositoryPort;
  clientRepositoryDb: ClientRepositoryPort;
}) => {
  return {
    execute: async (clientId?: string): Promise<Visit[]> => {
      if (clientId) {
        const clientExists = await dependencies.clientRepositoryDb.findById(
          clientId
        );
        if (!clientExists) {
          throw ClientNotFoundError(clientId);
        }
      }

      const visits = await dependencies.visitRepositoryDb.findAll(clientId);
      return visits;
    },
  };
};

const getVisitsUseCase = createGetVisitsUseCase({
  visitRepositoryDb: visitRepositoryDb,
  clientRepositoryDb: clientRepositoryDb,
});

export type CreateGetVisitsUseCaseType = ReturnType<
  typeof createGetVisitsUseCase
>;

export default getVisitsUseCase;
