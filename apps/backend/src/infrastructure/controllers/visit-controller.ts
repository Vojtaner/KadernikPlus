import {
  addVisitUseCase,
  CreateAddVisitUseCaseType,
} from "../../application/use-cases/add-visit";
import { CreateGetVisitsUseCaseType } from "@/application/use-cases/get-visits";
import { Visit, VisitCreateData } from "@/entities/visit";
import { ControllerFunction } from "@/utils/make-express-callback";
import getVisitsUseCase from "../../application/use-cases/get-visits";
import findVisitByIdUseCase, {
  CreateFindVisitByIdType,
} from "../../application/use-cases/find-visit-by-id";
import { HasClientId, HasId } from "@/domain/entity";

type GetVisitsControllerType = { query: HasClientId };
type AddVisitControllerType = { body: VisitCreateData };
type FindVisitByIdControllerType = { query: HasId };

const createVisitController = (dependencies: {
  addVisitUseCase: CreateAddVisitUseCaseType;
  getVisitsUseCase: CreateGetVisitsUseCaseType;
  findVisitByIdUseCase: CreateFindVisitByIdType;
}) => {
  const addVisitController: ControllerFunction<AddVisitControllerType> = async (
    httpRequest
  ) => {
    try {
      const visitData = httpRequest.body;

      if (
        !visitData.clientId ||
        !visitData.userId ||
        !visitData.date ||
        visitData.paidPrice === undefined
      ) {
        return {
          statusCode: 400,
          body: {
            error:
              "Missing required visit fields: clientId, userId, date, paidPrice.",
          },
        };
      }

      if (typeof visitData.date === "string") {
        visitData.date = new Date(visitData.date);
      }
      if (isNaN(visitData.date.getTime())) {
        return {
          statusCode: 400,
          body: { error: "Invalid date format for visit date." },
        };
      }

      const newVisit = await dependencies.addVisitUseCase.execute(visitData);

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

  const getVisitsController: ControllerFunction<
    GetVisitsControllerType
  > = async (httpRequest) => {
    try {
      const clientId = httpRequest.query.clientId;
      const visits = await dependencies.getVisitsUseCase.execute(clientId);

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

  const findVisitByIdController: ControllerFunction<
    FindVisitByIdControllerType
  > = async (httpRequest) => {
    try {
      const id = httpRequest.query.id;
      const visit = await dependencies.findVisitByIdUseCase.execute(id);

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

  return {
    addVisitController,
    getVisitsController,
    findVisitByIdController,
  };
};

const visitController = createVisitController({
  addVisitUseCase,
  getVisitsUseCase,
  findVisitByIdUseCase,
});

export default visitController;
