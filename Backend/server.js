require("dotenv").config();

const app = require("./src/app");
const connectToDB = require("./src/db/db");
const PORT = process.env.PORT || 3000;

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port : 3000");
    });
  })
  .catch((err) => {
    console.log("Failed to Connect ❌");
  });
