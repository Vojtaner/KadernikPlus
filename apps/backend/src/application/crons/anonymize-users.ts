import dayjs from "dayjs";
import { UserRepositoryPort } from "../ports/user-repository";
import cron from "node-cron";
import userRepositoryDb from "../../infrastructure/data/prisma/prisma-user-repository";
import { ManagementClient } from "auth0";
import { auth0ManagementApi } from "../services/auth0/auth0ManagementApi";

const anonymizeScheduledUsers = async (dependencies: {
  userRepositoryDb: UserRepositoryPort;
  auth0ManagementApi: ManagementClient;
}) => {
  const now = new Date();

  const usersToAnonymize =
    await dependencies.userRepositoryDb.findPendingDeletionUsers(now);

  await Promise.all(
    usersToAnonymize.map(async (user) => {
      await dependencies.auth0ManagementApi.users.delete({
        id: user.id,
      });

      await dependencies.userRepositoryDb.update(user.id, {
        email: `deleted${dayjs().format("YYYYMMDDHHmmss")}@deleted.com`,
        name: `user_deleted${dayjs().format("YYYY.MM.DD-HH:mm")}`,
        deletionScheduledAt: null,
        bankAccount: null,
        reviewUrl: null,
        authProvider: null,
      });
    })
  );

  console.log(
    "Anonymized users:",
    usersToAnonymize.map((u) => u.id)
  );
};

export default cron.schedule(
  "10 11 * * *",
  async () => {
    console.log("Running scheduled user anonymization:", new Date());

    try {
      await anonymizeScheduledUsers({ userRepositoryDb, auth0ManagementApi });
      console.log("Anonymization complete");
    } catch (err) {
      console.error("Error during anonymization:", err);
    }
  },
  { timezone: "Europe/Prague" }
);
