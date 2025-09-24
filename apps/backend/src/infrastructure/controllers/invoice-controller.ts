import { httpError } from "../../adapters/express/httpError";
import { ControllerFunction } from "../../adapters/express/make-express-callback";
import getInvoicesUseCase, {
  GetInvoicesUseCaseType,
} from "../../application/use-cases/invoice/get-invoices";

type InvoicesControllerType = {
  getnvoicesControllerType: ControllerFunction<{}>;
};

const createInvoicesController = (dependencies: {
  getInvoicesUseCase: GetInvoicesUseCaseType;
}) => {
  const getSubscriptionController: ControllerFunction<
    InvoicesControllerType["getnvoicesControllerType"]
  > = async (httpRequest) => {
    const userId = httpRequest.userId;
    const invoices = await dependencies.getInvoicesUseCase.execute(userId);

    if (!invoices || !invoices.length) {
      throw httpError("Faktury nenalezeny.", 404);
    }

    return { statusCode: 200, body: invoices };
  };

  return {
    getSubscriptionController,
  };
};

const invoiceController = createInvoicesController({ getInvoicesUseCase });

export default invoiceController;
