import asyncHandler from "express-async-handler";
import { Router, Request, Response } from "express";
import vars from "../../../config/vars";

const errorRouter = Router();

// local router
errorRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next) => {
    res.render("error", {
      redirectRoute: vars.WEB_URL,
    });
  })
);

export default errorRouter;
