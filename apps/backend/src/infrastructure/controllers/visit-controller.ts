import {
  addVisitUseCase,
  CreateAddVisitUseCaseType,
} from "../../application/use-cases/visits/add-visit";
import { VisitCreateData, VisitDetailFormType } from "@/entities/visit";
import { ControllerFunction } from "@/adapters/express/make-express-callback";
import getVisitByIdUseCase, {
  CreateGetVisitByIdUseCaseType,
} from "../../application/use-cases/visits/get-visit-by-id";
import getVisitsByClientIdUseCase, {
  CreateGetVisitsByClientIdUseCaseType,
} from "../../application/use-cases/visits/get-visits-by-client-id";
import getVisitsByDatesUseCase, {
  CreateGetVisitsByDatesUseCaseType,
} from "../../application/use-cases/visits/get-visits-by-date";
import deleteVisitUseCase, {
  CreateDeleteVisitUseCaseType,
} from "../../application/use-cases/visits/delete-visit";
import {
  CreateUpdateVisitUseCaseType,
  updateVisitUseCase,
} from "../../application/use-cases/visits/update-visit";
import updateVisitStatusUseCase, {
  UpdateVisitStatusUseCaseType,
} from "../../application/use-cases/visits/update-visit-status";

// type GetVisitsControllerType = { query: HasClientId };
type GetVisitsByDatesControllerType = {
  query: { date?: Date; to?: Date; from?: Date };
};
type AddVisitControllerType = { body: VisitCreateData };
type UpdateVisitStatusControllerType = {
  body: { visitId: string; status: boolean };
};
type GetVisitByIdControllerType = { query: { visitId: string } };
type UpdateVisitControllerType = {
  params: { visitId: string };
  body: VisitDetailFormType;
};
type GetVisitsByClientIdControllerType = {
  params: { clientId: string };
};
type DeleteVisitControllerType = { params: { id: string } };

const createVisitController = (dependencies: {
  addVisitUseCase: CreateAddVisitUseCaseType;
  getVisitsByDatesUseCase: CreateGetVisitsByDatesUseCaseType;
  getVisitsByClientIdUseCase: CreateGetVisitsByClientIdUseCaseType;
  getVisitByIdUseCase: CreateGetVisitByIdUseCaseType;
  updateVisitUseCase: CreateUpdateVisitUseCaseType;
  deleteVisitUseCase: CreateDeleteVisitUseCaseType;
  updateVisitStatusUseCase: UpdateVisitStatusUseCaseType;
}) => {
  const addVisitController: ControllerFunction<AddVisitControllerType> = async (
    httpRequest
  ) => {
    function addHours(date: Date, hours: number): Date {
      return new Date(date.getTime() + hours * 60 * 60 * 1000);
    }
    try {
      const visitData = httpRequest.body;
      const original = new Date(visitData.date);
      const shiftedTime = addHours(original, 2);
      const userId = httpRequest.userId;
      const visitDataWithUserId = { ...visitData, userId, date: shiftedTime };

      if (!visitData.clientId || !visitDataWithUserId.date || !userId) {
        return {
          statusCode: 400,
          body: {
            error: "Missing required visit fields: clientId, userId, date.",
          },
        };
      }

      const newVisit = await dependencies.addVisitUseCase.execute(
        visitDataWithUserId
      );

      return {
        statusCode: 201,
        body: newVisit,
      };
    } catch (error: any) {
      if (
        error.name === "UserNotFoundError" ||
        error.name === "ClientNotFoundError"
      ) {
        return {
          statusCode: 400,
          body: { error: error.message },
        };
      }

      console.error("Error in addVisitController:", error);
      throw error;
    }
  };

  const getVisitsByDatesController: ControllerFunction<
    GetVisitsByDatesControllerType
  > = async (httpRequest) => {
    const to = new Date();
    to.setDate(to.getDate() + 10);
    const userId = httpRequest.userId;
    const from = new Date();

    try {
      const visits = await dependencies.getVisitsByDatesUseCase.execute({
        from,
        to: to,
        userId: userId,
      });

      return {
        statusCode: 200,
        body: visits,
      };
    } catch (error: any) {
      if (error.name === "ClientNotFoundError") {
        return {
          statusCode: 400,
          body: { error: error.message },
        };
      }

      console.error("Error in getVisitsController:", error);
      throw error;
    }
  };

  const getVisitByIdController: ControllerFunction<
    GetVisitByIdControllerType
  > = async (httpRequest) => {
    try {
      const { visitId } = httpRequest.params;
      const visit = await dependencies.getVisitByIdUseCase.execute(visitId);

      return {
        statusCode: 200,
        body: visit,
      };
    } catch (error: any) {
      if (error.name === "VisitNotFoundError") {
        return {
          statusCode: 400,
          body: { error: error.message },
        };
      }

      console.error("Error in findVisitByIdController:", error);
      throw error;
    }
  };
  const updateVisitStatusController: ControllerFunction<
    UpdateVisitStatusControllerType
  > = async (httpRequest) => {
    try {
      const { visitId, status } = httpRequest.body;

      if (!visitId || typeof status !== "boolean") {
        throw Error("Missing or invalid visitId or checked");
      }

      const updatedVisit = await dependencies.updateVisitStatusUseCase.execute({
        visitId,
        status,
      });

      return {
        statusCode: 200,
        body: updatedVisit,
      };
    } catch (err) {
      throw err;
    }
  };
  const updateVisitController: ControllerFunction<
    UpdateVisitControllerType
  > = async (httpRequest) => {
    try {
      const visitId = httpRequest.params.visitId;
      const visitData = httpRequest.body;

      const updatedVisit = await dependencies.updateVisitUseCase.execute({
        id: visitId,
        ...visitData,
      });

      return {
        statusCode: 200,
        body: updatedVisit,
      };
    } catch (error: any) {
      if (error.name === "VisitNotFoundError") {
        return {
          statusCode: 404,
          body: { error: error.message },
        };
      }

      console.error("Error in updateVisitController:", error);
      throw error;
    }
  };

  const getVisitsByClientIdController: ControllerFunction<
    GetVisitsByClientIdControllerType
  > = async (httpRequest) => {
    try {
      const clientId = httpRequest.params.clientId;

      const visits = await dependencies.getVisitsByClientIdUseCase.execute(
        clientId
      );

      return {
        statusCode: 200,
        body: visits,
      };
    } catch (error: any) {
      if (error.name === "ClientNotFoundError") {
        return {
          statusCode: 404,
          body: { error: error.message },
        };
      }

      console.error("Error in getVisitsByClientIdController:", error);
      throw error;
    }
  };

  const deleteVisitController: ControllerFunction<
    DeleteVisitControllerType
  > = async (httpRequest) => {
    try {
      const visitId = httpRequest.params.id;

      await dependencies.deleteVisitUseCase.execute(visitId);

      return {
        statusCode: 204,
        body: null,
      };
    } catch (error: any) {
      if (error.name === "VisitNotFoundError") {
        return {
          statusCode: 404,
          body: { error: error.message },
        };
      }

      console.error("Error in deleteVisitController:", error);
      throw error;
    }
  };

  return {
    addVisitController,
    getVisitsByDatesController,
    getVisitByIdController,
    updateVisitController,
    getVisitsByClientIdController,
    deleteVisitController,
    updateVisitStatusController,
  };
};

const visitController = createVisitController({
  addVisitUseCase,
  getVisitsByDatesUseCase,
  getVisitsByClientIdUseCase,
  getVisitByIdUseCase,
  updateVisitUseCase,
  deleteVisitUseCase,
  updateVisitStatusUseCase,
});

export default visitController;
