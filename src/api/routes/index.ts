import express from "express";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import asyncHandler from "express-async-handler";
import errorRouter from "./error.route";
const router = express.Router();

/**
 * GET v1/status
 */
router.get(
  "/status",
  asyncHandler(async (req, res) => {
    res.send("OK");
  })
);

/**
 * GET v1/docs
 */
router.use(
  "/docs",
  asyncHandler(async () => {
    express.static("docs");
  })
);

/**
 * use v1/auth
 */
router.use("/auth", authRouter);

/**
 * use v1/me
 */
router.use("/me", userRouter);

/**
 * use v1/error
 */
router.use("/error", errorRouter);

export default router;
