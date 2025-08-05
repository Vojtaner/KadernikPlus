// infrastructure/controllers/procedure-controller.ts
import { ControllerFunction } from "@/adapters/express/make-express-callback";
import { ProcedureCreateData } from "../../application/ports/procedure-repository";
import addOrUpdateProcedureUseCase, {
  AddOrUpdateProcedureUseCaseType,
} from "../../application/use-cases/procedures/add-or-update-procedure";
import getProceduresUseCase, {
  GetProceduresUseCaseType,
} from "../../application/use-cases/procedures/get-procedures";

type AddOrUpdateProcedureControllerType = {
  params: { visitId: string };
  body?: {};
};
type GetProceduresControllerType = {
  params: { visitId: string };
};

export const createProcedureController = (dependencies: {
  getProceduresUseCase: GetProceduresUseCaseType;
  addOrUpdateProcedureUseCase: AddOrUpdateProcedureUseCaseType;
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
  };
};

const procedureController = createProcedureController({
  getProceduresUseCase,
  addOrUpdateProcedureUseCase,
});

export default procedureController;
