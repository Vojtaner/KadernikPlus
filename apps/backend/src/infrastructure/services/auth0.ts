import { getEnvVar } from "../../utils/getEnvVar";
import { ManagementClient } from "auth0";

export const managementApi = new ManagementClient({
  clientId: getEnvVar("AUTH0_M2M_CLIENT_ID"),
  clientSecret: getEnvVar("AUTH0_M2M_CLIENT_SECRET"),
  domain: getEnvVar("APPLICATION_DOMAIN"),
});
