import { httpError } from "../../../adapters/express/httpError";
import { getEnvVar } from "../../../utils/getEnvVar";
import axios from "axios";

export type ComgatePaymentApiType = {
  createPayment: (
    data: ComgatePaymentData
  ) => Promise<ComgateCreatePaymentReturnType>;
  recurringPayment: (
    data: ComgateRecurringPayment
  ) => Promise<ComgatePaymentReturnType>;
};

export type ComgatePaymentData = {
  price: string | number;
  currency: string;
  email: string;
  label: string;
  phone: string;
  refId: string;
  fullName: string;
};

export type ComgateUpdatePaymentRequired = {
  transId: string;
  status: string;
  fullName: string;
  test: boolean;
} & ComgatePaymentRequired;

type ComgatePaymentRequired = {
  price: string;
  curr: string;
  label: string;
  refId: string;
  merchant: string;
  secret: string;
  email: string;
};

export type ComgateCreatePaymentRequired = {
  initRecurring?: boolean;
  method: string;
  phone: string;
  fullName: string;
  test: "0" | "1";
} & ComgatePaymentRequired;

export type ComgateCreatePaymentReturnType = ComgatePaymentReturnType & {
  redirect: string;
};

export type ComgatePaymentReturnType = {
  code: number;
  message: string;
  transId: string;
};

export type ComgateRecurringPayment = {
  price: number;
  curr: string;
  label: string;
  refId: string;
  initRecurringId: string;
  test?: string;
  account?: string;
  name?: string;
};

export function generate8DigitNumber() {
  return Math.floor(10000000 + Math.random() * 90000000);
}

const createComgatePaymentApi = (): ComgatePaymentApiType => {
  const createPayment = async (data: ComgatePaymentData) => {
    const body: ComgateCreatePaymentRequired = {
      merchant: getEnvVar("MERCHANT"),
      test: getEnvVar("IS_DEVELOPMENT") === "true" ? "1" : "0",
      price: data.price.toString(),
      curr: data.currency,
      label: `Subscription ${data.label}`,
      refId: data.refId,
      method: "ALL",
      email: data.email,
      fullName: data.fullName,
      initRecurring: true,
      phone: data.phone,
      secret: getEnvVar("COMGATE_SECRET"),
    };

    const autorizace = `${
      "Basic " +
      base64_encode(`${getEnvVar("MERCHANT")}:${getEnvVar("COMGATE_SECRET")}`)
    }`;

    try {
      const response = await axios.post<ComgateCreatePaymentReturnType>(
        "https://payments.comgate.cz/v2.0/payment.json",
        body,
        {
          headers: {
            Authorization: autorizace,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Comgate create payment error:",
        error.response?.data || error.message
      );
      throw httpError(error.response?.data.message, error.response?.data.code);
    }
  };

  const recurringPayment = async (data: ComgateRecurringPayment) => {
    const body: ComgateRecurringPayment = {
      test: getEnvVar("IS_DEVELOPMENT") === "true" ? "1" : "0",
      price: data.price,
      curr: data.curr,
      label: `Subscription ${data.label}`,
      refId: data.refId,
      name: data.label,
      initRecurringId: data.initRecurringId,
    };

    const autorizace = `${
      "Basic " +
      base64_encode(`${getEnvVar("MERCHANT")}:${getEnvVar("COMGATE_SECRET")}`)
    }`;

    try {
      const response = await axios.post<ComgatePaymentReturnType>(
        "https://payments.comgate.cz/v2.0/recurring.json",
        body,
        {
          headers: {
            Authorization: autorizace,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Comgate recurring  payment error:",
        error.response?.data || error.message
      );
      throw httpError(error.response?.data.message, error.response?.data.code);
    }
  };

  return { createPayment, recurringPayment };
};

const comgatePaymentApi = createComgatePaymentApi();

export default comgatePaymentApi;

const base64_encode = (text: string) => {
  return Buffer.from(text, "utf8").toString("base64");
};
