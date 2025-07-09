"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVisitUseCase = void 0;
exports.UserNotFoundError = UserNotFoundError;
exports.ClientNotFoundError = ClientNotFoundError;
const prisma_visit_repository_1 = __importDefault(require("../../infrastructure/data/prisma/prisma-visit-repository"));
function UserNotFoundError(id) {
    const error = new Error(`User with ID '${id}' not found.`);
    error.name = "UserNotFoundError";
    return error;
}
function ClientNotFoundError(id) {
    const error = new Error(`Client with ID '${id}' not found.`);
    error.name = "ClientNotFoundError";
    return error;
}
/**
 * Use case to add a new visit to the system.
 * It encapsulates the business rules that both the client and user (hairdresser)
 * associated with the visit must exist.
 */
// export class AddVisit {
//   private readonly visitRepository: VisitRepository;
//   private readonly userRepository: UserRepository;
//   private readonly clientRepository: ClientRepository;
//   /**
//    * @param visitRepository An implementation of the VisitRepository interface.
//    * @param userRepository An implementation of the UserRepository interface (for validation).
//    * @param clientRepository An implementation of the ClientRepository interface (for validation).
//    */
//   constructor(
//     visitRepository: VisitRepository,
//     userRepository: UserRepository,
//     clientRepository: ClientRepository
//   ) {
//     this.visitRepository = visitRepository;
//     this.userRepository = userRepository;
//     this.clientRepository = clientRepository;
//   }
//   /**
//    * Executes the use case to add a new visit.
//    * @param visitData The data for the new visit.
//    * @returns A Promise that resolves to the created Visit entity.
//    * @throws UserNotFoundError if the specified user does not exist.
//    * @throws ClientNotFoundError if the specified client does not exist.
//    */
//   async execute(visitData: VisitCreateData): Promise<Visit> {
//     // 1. Business rule: Ensure the associated user (hairdresser) exists.
//     const userExists = await this.userRepository.findById(visitData.userId);
//     if (!userExists) {
//       throw new UserNotFoundError(visitData.userId);
//     }
//     // 2. Business rule: Ensure the associated client exists.
//     const clientExists = await this.clientRepository.findById(
//       visitData.clientId
//     );
//     if (!clientExists) {
//       throw new ClientNotFoundError(visitData.clientId);
//     }
//     // 3. Persist the new visit data using the repository.
//     const newVisit = await this.visitRepository.add(visitData);
//     return newVisit;
//   }
// }
const createAddVisitUseCase = (dependencies) => ({
    execute: async (visitData) => {
        const visit = await prisma_visit_repository_1.default.add(visitData);
        // a další logika s přidáním návštěvy emaily, jiné databázové operace atd...
        return visit;
    },
});
exports.addVisitUseCase = createAddVisitUseCase({ visitRepositoryDb: prisma_visit_repository_1.default });
