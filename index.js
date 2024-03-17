const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({path: "./config.env"});
const ApiError = require("./utils/apiError");
const errorObject = require('./utils/errorObject');
const globalErrore = require("./middlewares/erroreMiddleware");

const dbConection = require(`./config/database`);

// Routes
const mountRoutes = require("./routes");

// dbConnection
dbConection();

// express app
const app = express();

// middlewares
app.use(express.json({ limit: '20kb' }));

if (process.env.NODE_ENV === `development`) {
  app.use(morgan("tiny"));
  console.log(
    `mode: ${process.env.NODE_ENV}`
  );
};

// Mounet Routes
mountRoutes(app);

app.all(`*`, (req, _, next) => {

  const message = `can't find this route: ${req.originalUrl}`;

  throw next(
    new ApiError(
      message,
      errorObject(
        `${req.protocol}://${req.get('host')}${req.path}`,
        message,
        req.originalUrl,
        'route'
      ),
      400)
  );

});

// Global error handling middleware
app.use(globalErrore);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, _ => {
  console.log(
    `app runnig on port ${PORT}`
  );
});

// handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Erorr: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down...");
    process.exit(1);
  });
});