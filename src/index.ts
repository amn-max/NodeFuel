import vars from "./config/vars";
import logger from "./config/logger";
import app from "./config/express";

// listen to requests
app.listen(vars.port, () =>
  logger.info(`server started on port http://localhost:${vars.port}`)
);
