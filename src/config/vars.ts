import path from "path";
import dotenv from "dotenv-safe";
// import .env variables
dotenv.config({
  path: path.join(__dirname, "../../.env"),
  example: path.join(__dirname, "../../.env.example"),
});

const vars = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  WEB_URL: process.env.REDIRECT_WEB_URL,
  useGoogleStrategy: false, // Set this to true if you have a valid Google client ID and secret
  useFacebookStrategy: false, // Set this to true if you have a valid Facebook app ID and secret
  useTwitterStrategy: false, // Set this to true if you have a valid Twitter consumerKey and consumerSecret
  useGithubStrategy: false, // Set this to true if you have a valid Github consumerKey and consumerSecret
};
export default vars;
