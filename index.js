const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "./config.env" });
const ApiError = require("./utils/apiError");
const errorObject = require("./utils/errorObject");
const globalErrore = require("./middlewares/erroreMiddleware");
const AuthRouter = require('./routes/auth/index');
const dbConection = require(`./config/database`);
const cookieParser = require('cookie-parser');
const cors = require('cors'); 
const AuthVerifierMiddleware = require('./middlewares/auth/index')

// Routes
const mountRoutes = require("./routes");



// dbConnection
dbConection();

// express app
const app = express();

// setup cors and cookie parser 
app.use(cors({credentials:true,origin: true,methods:["POST","DELETE","GET","PUT"]}));
app.use(cookieParser())




// middlewares
app.use(express.json({ limit: "20kb" }));

if (process.env.NODE_ENV === `development`) {
  app.use(morgan("tiny"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}


// use Auth Router
app.use('/auth',AuthRouter);

// test route 
app.get('/me',AuthVerifierMiddleware,(req,res)=>{
  return res.json({you:req.user});
})

// Mount Routes
mountRoutes(app);


app.all(`*`, (req, _, next) => {
  const message = `can't find this route: ${req.originalUrl}`;

  throw next(
    new ApiError(
      message,
      errorObject(
        `${req.protocol}://${req.get("host")}${req.path}`,
        message,
        req.originalUrl,
        "route"
      ),
      400
    )
  );
});

// Global error handling middleware
app.use(globalErrore);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, (_) => {
  console.log(`app running on port ${PORT}`);
});

// handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down...");
    process.exit(1);
  });
});
