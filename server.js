const app = require("./app");
const connectDatabase = require("./config/database");
const dotenv = require("dotenv");

// handle uncoaught exception
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("shutting down the server due to uncaught exception");

  process.exit(1);
});
// Setting up config file
dotenv.config({ path: "backend/config/config.env" });

console.log("DB_LOCAL_URI:", process.env.DB_LOCAL_URI);

// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

// handle unhandled promrise rejection

process.on("uhhandledRejection", (err) => {
  console.on(`Error: ${err.message}`);
  console.log("shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
