const cron = require("node-cron");
const userModel = require("../models/users.model");


const removeUnverifiedAccounts = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const timeLimit = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const deletedUsers = await userModel.deleteMany({
        isVerified: false,
        createdAt: { $lt: timeLimit },
      });

      console.log(`${deletedUsers.deletedCount} unverified accounts deleted`);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = removeUnverifiedAccounts;