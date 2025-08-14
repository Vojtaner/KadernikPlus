// infrastructure/controllers/procedure-controller.ts
import { ControllerFunction } from "@/adapters/express/make-express-callback";
import { ProcedureCreateData } from "../../application/ports/procedure-repository";
import addOrUpdateProcedureUseCase, {
  AddOrUpdateProcedureUseCaseType,
} from "../../application/use-cases/procedures/add-or-update-procedure";
import getProceduresUseCase, {
  GetProceduresUseCaseType,
} from "../../application/use-cases/procedures/get-procedures";
import deleteProcedureUseCase, {
  DeleteProcedureUseCaseType,
} from "../../application/use-cases/procedures/delete-procedure";

type AddOrUpdateProcedureControllerType = {
  params: { visitId: string };
  body?: {};
};
type GetProceduresControllerType = {
  params: { visitId: string };
};
type DeleteProcedureControllerType = {
  params: { id: string };
};

export const createProcedureController = (dependencies: {
  getProceduresUseCase: GetProceduresUseCaseType;
  addOrUpdateProcedureUseCase: AddOrUpdateProcedureUseCaseType;
  deleteProcedureUseCase: DeleteProcedureUseCaseType;
}) => {
  const getProceduresController: ControllerFunction<
    GetProceduresControllerType
  > = async (httpRequest) => {
    try {
      const visitId = httpRequest.params.visitId;
      const result = await dependencies.getProceduresUseCase.execute(visitId);

      return { statusCode: 200, body: result };
    } catch (error: any) {
      console.error("getProceduresController", error);
      return { statusCode: 500, body: { error: error.message } };
    }
  };
  const deleteProcedureController: ControllerFunction<
    DeleteProcedureControllerType
  > = async (httpRequest) => {
    try {
      const procedureId = httpRequest.params.id;
      const result = await dependencies.deleteProcedureUseCase.execute(
        procedureId
      );

      return { statusCode: 200, body: result };
    } catch (error: any) {
      console.error("deleteProcedureController", error);
      return { statusCode: 500, body: { error: error.message } };
    }
  };

  const addOrUpdateProcedureController: ControllerFunction<
    AddOrUpdateProcedureControllerType
  > = async (httpRequest) => {
    try {
      const visitId = httpRequest.params.visitId;
      const procedureData: ProcedureCreateData = {
        ...httpRequest.body,
        visitId,
        userId: httpRequest.userId,
      };

      const result = await dependencies.addOrUpdateProcedureUseCase.execute(
        procedureData
      );

      return { statusCode: 201, body: result };
    } catch (error: any) {
      console.error("addOrUpdateProcedureController", error);
      return { statusCode: 400, body: { error: error.message } };
    }
  };

  return {
    getProceduresController,
    addOrUpdateProcedureController,
    deleteProcedureController,
  };
};

const procedureController = createProcedureController({
  getProceduresUseCase,
  addOrUpdateProcedureUseCase,
  deleteProcedureUseCase,
});

export default procedureController;
