import express = require("express");
import ensureAuthenticated from "../../middlewares/ensureAuthenticated";
import authRouter from "./auth.route";
import userRouter from "./user.route";

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

/**
 * GET v1/docs
 */
router.use("/docs", express.static("docs"));

/**
 * use v1/auth
 */
router.use('/auth', authRouter)


/**
 * use v1/me
 */
router.use('/me', ensureAuthenticated , userRouter);

export default router;
