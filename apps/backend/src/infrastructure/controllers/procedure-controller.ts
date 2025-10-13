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
    const visitId = httpRequest.params.visitId;
    const result = await dependencies.getProceduresUseCase.execute(visitId);
    return { statusCode: 200, body: result };
  };

  const deleteProcedureController: ControllerFunction<
    DeleteProcedureControllerType
  > = async (httpRequest) => {
    const procedureId = httpRequest.params.id;
    const result = await dependencies.deleteProcedureUseCase.execute(
      procedureId
    );
    return { statusCode: 200, body: result };
  };

  const addOrUpdateProcedureController: ControllerFunction<
    AddOrUpdateProcedureControllerType
  > = async (httpRequest) => {
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
