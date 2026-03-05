require("dotenv").config();
require("./src/services/cloudinary");

const app = require("./src/app");
const connectToDB = require("./src/db/db");
const notifyUsers = require("./src/services/notifyUsers");
const removeUnverifiedAccounts = require("./src/services/removeUnverifiedAccounts");
const PORT = process.env.PORT || 3000;

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port : 3000");

      // Automation services start
      notifyUsers();
      removeUnverifiedAccounts();
    });
  })
  .catch((err) => {
    console.log("Failed to Connect ❌");
  });
