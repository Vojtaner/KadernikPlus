import { getEnvVar } from "../../../utils/getEnvVar";
import { ManagementClient } from "auth0";

export const auth0ManagementApi = new ManagementClient({
  clientSecret: getEnvVar("AUTH0_M2M_CLIENT_SECRET"),
  clientId: getEnvVar("AUTH0_M2M_CLIENT_ID"),
  domain: getEnvVar("AUTH0_M2M_DOMAIN"),
  audience: "https://dev-vmu4oy0e2nc3n6l6.us.auth0.com/api/v2/",
});
