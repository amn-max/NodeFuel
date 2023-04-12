import express = require("express");
import oAuth from "../../auth/oauth2.server";
import OAuth2Server from "oauth2-server";
import authenticateRequest from "../../middlewares/authenticateRequest";
import obtainToken from "../../middlewares/obtainToken";
import authorizeUser from "../../middlewares/authorizeUser";
const router = express.Router();
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));
/**
 * GET v1/docs
 */
router.use("/docs", express.static("docs"));

router.all("/oauth/token", obtainToken);

router.post("/oauth/authorize", authorizeUser);

router.get("/", authenticateRequest, (req, res) => {
  res.send("Congratulations, you are in a secret area!");
});

export default router;
