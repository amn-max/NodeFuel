import path = require('path');
import dotenv = require('dotenv-safe');
// import .env variables
dotenv.config({
  path: path.join(__dirname, '../../.env'),
  example: path.join(__dirname, '../../.env.example'),
});

const vars = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
}
export default vars;

