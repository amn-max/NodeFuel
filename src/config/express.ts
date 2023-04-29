import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import compress from "compression";
import methodOverride from "method-override";
import cors from "cors";
import helmet from "helmet";
import router from "../api/routes/v1";
import { converter, handler, notFound } from "../api/middlewares/error";
import { stream } from "./logger";
import passport from "../api/auth/passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
import vars from "./vars";

const rootPath = path.dirname(path.dirname(__dirname));

/**
 * Express instance
 * @public
 */
const app = express();

// request logging. dev: console | production: file
app.use(morgan("combined", { stream }));

//views
const viewsPath = path.join(rootPath, "src", "views");
app.set("views", viewsPath);
app.set("view engine", "ejs");

// cookie
app.use(cookieParser(process.env.SERVER_SECRET));

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
app.use(
  cors({
    origin: vars.WEB_URL,
    credentials: true, // most important
  })
);

// session secret for passport
let sess: any = {
  secret: process.env.SERVER_SECRET!,
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true, maxAge:3600000 }, // remove this line for HTTP connection
};

if (vars.env === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
  sess.cookie.maxAge = 3600000; // serve secure cookies
}
app.use(session(sess));

// initiate passport middleware before the routes registration
app.use(passport.initialize());

// persistent login sessions
app.use(passport.session());

// mount api v1 routes
app.use("/v1", router);

//welcome
app.get("/", (req, res) => {
  res.send("Hey Looks Like you got it working! Congrats.");
});

// if error is not an instanceOf APIError, convert it.
app.use(converter);

// catch 404 and forward to error handler
app.use(notFound);

// error handler, send stacktrace only during development
app.use(handler);

export default app;
