"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="36a56ca6-496e-52cc-9f20-1b692cd756b1")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate8DigitNumber = generate8DigitNumber;
const getEnvVar_1 = require("../../../utils/getEnvVar");
const axios_1 = __importDefault(require("axios"));
function generate8DigitNumber() {
    return Math.floor(10000000 + Math.random() * 90000000);
}
const createComgatePaymentApi = () => {
    const createPayment = async (data) => {
        const body = {
            merchant: (0, getEnvVar_1.getEnvVar)("MERCHANT"),
            test: (0, getEnvVar_1.getEnvVar)("IS_DEVELOPMENT") === "true" ? "1" : "0",
            price: data.price.toString(),
            curr: data.currency,
            label: `Subscription ${data.label}`,
            refId: data.refId,
            method: "ALL",
            email: data.email,
            fullName: data.fullName,
            phone: data.phone,
            secret: (0, getEnvVar_1.getEnvVar)("COMGATE_SECRET"),
        };
        const base64_encode = (text) => {
            return Buffer.from(text, "utf8").toString("base64");
        };
        const autorizace = `${"Basic " +
            base64_encode(`${(0, getEnvVar_1.getEnvVar)("MERCHANT")}:${(0, getEnvVar_1.getEnvVar)("COMGATE_SECRET")}`)}`;
        console.log({ autorizace });
        try {
            const response = await axios_1.default.post("https://payments.comgate.cz/v2.0/payment.json", body, {
                headers: {
                    Authorization: autorizace,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            console.log({ response });
            return response.data;
        }
        catch (error) {
            console.error("Comgate create payment error:", error.response?.data || error.message);
            throw new Error("Chyba při vytváření platby Comgate.");
        }
    };
    return { createPayment };
};
const comgatePaymentApi = createComgatePaymentApi();
exports.default = comgatePaymentApi;
//# sourceMappingURL=comgatePaymentApi.js.map
//# debugId=36a56ca6-496e-52cc-9f20-1b692cd756b1
