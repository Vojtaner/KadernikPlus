import { ControllerFunction } from "@/adapters/express/make-express-callback";
import getAllLogsUseCase, {
  GetAllLogsUseCaseType,
} from "../../application/use-cases/logs/get-all-logs";

type GetAllLogsControllerType = {};

const createLogController = (dependencies: {
  getAllLogsUseCase: GetAllLogsUseCaseType;
}) => {
  const getAllLogsController: ControllerFunction<
    GetAllLogsControllerType
  > = async (httpRequest) => {
    const userId = httpRequest.userId;

    const logs = await dependencies.getAllLogsUseCase.execute(userId);

    return {
      statusCode: 200,
      body: logs,
    };
  };

  return {
    getAllLogsController,
  };
};

const logController = createLogController({
  getAllLogsUseCase,
});

export default logController;
