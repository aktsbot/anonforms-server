const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const addRequestId = require("express-request-id")({ setHeader: false });

// load envs first
dotenv.config();
const app = express();

const config = require("./config");
const db = require("./db");
const routes = require("./routes");

app.use(addRequestId);
app.use(express.json({ type: ["application/json"] }));

morgan.token("id", (req) => req.id.split("-")[0]);
app.use(
  morgan("[:date[iso] #:id] Started :method :url for :remote-addr", {
    immediate: true,
  })
);

app.use(
  morgan(
    "[:date[iso] #:id] Completed :status :res[content-length] in :response-time ms"
  )
);

// cors
app.use(function (req, res, next) {
  if (process.env.NODE_ENV === "development") {
    const appDomain = process.env.APP_DOMAIN || "http://localhost:3000";
    res.header("Access-Control-Allow-Origin", appDomain);
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, GET, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, x-af-auth"
    );
  }
  next();
});

app.use(`/api/${config.version}`, routes);

// error handlers for 40x and 50x errors
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }
  // user errors have a err.isClient field
  if (err.isClient) {
    let statusCode = 400;
    if (err.is403) {
      statusCode = 403;
    } else if (err.is404) {
      statusCode = 404;
    }
    return res.status(statusCode).json({
      message: err.message || `Bad request payload`,
    });
  } else {
    return res.status(500).json({
      message: `An internal error has occurred.`,
    });
  }
});

app.listen(config.port, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on port ${config.port}`);
});
