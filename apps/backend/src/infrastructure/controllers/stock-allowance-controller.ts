import { ControllerFunction } from "../../adapters/express/make-express-callback";
import getAllStockAllowancesByTeamIdUseCase, {
  GetAllStockAllowancesByTeamIdUseCaseType,
} from "../../application/use-cases/stock-allowances/get-all-stock-allowances-by-team-id";

type StockAllowanceControllerType = {
  GetAllStockAllowancesByTeamIdControllerType: {
    params: { teamId: string };
    query: { fromDate: Date; toDate: Date };
  };
};

const createStockAllowanceController = (dependencies: {
  getAllStockAllowancesByTeamIdUseCase: GetAllStockAllowancesByTeamIdUseCaseType;
}) => {
  const getAllStockAllowancesByTeamIdController: ControllerFunction<
    StockAllowanceControllerType["GetAllStockAllowancesByTeamIdControllerType"]
  > = async (httpRequest) => {
    const { teamId } = httpRequest.params;
    const userId = httpRequest.userId;
    const { fromDate, toDate } = httpRequest.query;

    try {
      const stockAllowances =
        await dependencies.getAllStockAllowancesByTeamIdUseCase.execute(
          teamId,
          userId,
          fromDate,
          toDate
        );

      return {
        statusCode: 200,
        body: stockAllowances,
      };
    } catch (error) {
      console.error("getAllStockAllowancesByTeamIdController", error);
      return {
        statusCode: 500,
        body: { error: "Server error" },
      };
    }
  };
  return { getAllStockAllowancesByTeamIdController };
};

const stockAllowanceController = createStockAllowanceController({
  getAllStockAllowancesByTeamIdUseCase,
});

export default stockAllowanceController;
