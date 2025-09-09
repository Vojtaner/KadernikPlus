import { getEnvVar } from "../../../utils/getEnvVar";
import axios from "axios";

export type ComgatePaymentApiType = {
  createPayment: (
    data: ComgatePaymentData
  ) => Promise<ComgateCreatePaymentReturnType>;
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
  method: string;
  phone: string;
  fullName: string;
  test: "0" | "1";
} & ComgatePaymentRequired;

export type ComgateCreatePaymentReturnType = {
  code: number;
  message: string;
  transId: string;
  redirect: string;
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
      phone: data.phone,
      secret: getEnvVar("COMGATE_SECRET"),
    };

    const base64_encode = (text: string) => {
      return Buffer.from(text, "utf8").toString("base64");
    };

    const autorizace = `${
      "Basic " +
      base64_encode(`${getEnvVar("MERCHANT")}:${getEnvVar("COMGATE_SECRET")}`)
    }`;

    console.log({ autorizace });

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
      console.log({ response });
      return response.data;
    } catch (error: any) {
      console.error(
        "Comgate create payment error:",
        error.response?.data || error.message
      );
      throw new Error("Chyba při vytváření platby Comgate.");
    }
  };

  return { createPayment };
};

const comgatePaymentApi = createComgatePaymentApi();

export default comgatePaymentApi;
