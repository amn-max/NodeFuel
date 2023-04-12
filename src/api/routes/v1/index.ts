import express = require("express");
import ensureAuthenticated from "../../middlewares/ensureAuthenticated";
import authRouter from "./auth.route";

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

/**
 * GET v1/docs
 */
router.use("/docs", express.static("docs"));

router.use('/auth', authRouter)

router.get('/user', ensureAuthenticated , (req, res) => {
    res.send(req.user)
});

export default router;
