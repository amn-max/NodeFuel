import vars from "./config/vars";
import logger from "./config/logger";
const app = require('./config/express')

// listen to requests
app.listen(vars.port, () => logger.info(`server started on port localhost:${vars.port}`));