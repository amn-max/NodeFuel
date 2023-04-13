import path = require("path");
import dotenv = require("dotenv-safe");
// import .env variables
dotenv.config({
  path: path.join(__dirname, "../../.env"),
  example: path.join(__dirname, "../../.env.example"),
});

const vars = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  WEB_URL: process.env.REDIRECT_WEB_URL,
  useGoogleStrategy: true, // Set this to true if you have a valid Google client ID and secret
  useFacebookStrategy: false, // Set this to true if you have a valid Facebook app ID and secret
  useTwitterStrategy: false, // Set this to true if you have a valid Twitter consumerKey and consumerSecret
};
export default vars;
