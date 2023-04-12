import express = require("express");
import morgan = require("morgan");
import bodyParser = require("body-parser");
import compress = require("compression");
import methodOverride = require("method-override");
import cors = require("cors");
import helmet from "helmet";
import router from "../api/routes/v1";
import { converter, handler, notFound } from "../api/middlewares/error";
import { stream } from "./logger";
import passport from '../api/auth/passport'
import cookieParser = require("cookie-parser");
import session = require("express-session");
/**
 * Express instance
 * @public
 */
const app = express();

// request logging. dev: console | production: file
app.use(morgan("combined", { stream }));

// cookie
app.use(cookieParser(process.env.SERVER_SECRET))

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true // most important
}));


// session secret for passport
app.use(
  session({
    secret: process.env.SERVER_SECRET!,
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true, maxAge:3600000 }, // remove this line for HTTP connection
  })
);

// initiate passport middleware before the routes registration
app.use(passport.initialize());

// persistent login sessions
app.use(passport.session());

// mount api v1 routes
app.use("/v1", router);

// if error is not an instanceOf APIError, convert it.
app.use(converter);

// catch 404 and forward to error handler
app.use(notFound);

// error handler, send stacktrace only during development
app.use(handler);

module.exports = app;
