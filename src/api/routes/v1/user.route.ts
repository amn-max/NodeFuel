import asyncHandler from "express-async-handler";

import express from "express";
const userRouter = express.Router();

userRouter.get(
  "/user",
  asyncHandler(async (req, res) => {
    res.send(req.user);
  })
);

export default userRouter;
