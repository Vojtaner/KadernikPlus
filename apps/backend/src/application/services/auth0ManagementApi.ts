import { getEnvVar } from "../../utils/getEnvVar";
import { ManagementClient } from "auth0";

export const auth0ManagementApi = new ManagementClient({
  clientId: getEnvVar("AUTH0_M2M_CLIENT_ID"),
  clientSecret: getEnvVar("AUTH0_M2M_CLIENT_SECRET"),
  domain: getEnvVar("AUTH0_M2M_DOMAIN"),
  audience: getEnvVar("AUTH0_M2M_AUDIENCE"),
});
