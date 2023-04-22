import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import APIError from "../errors/api-error";

// ensureAuthenticated
// check if user is authenticated
// if not, return 401
// if yes, call next()
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    const err = new APIError({
      message: "Unauthorized",
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    });
    return next(err);
  }
}

export default ensureAuthenticated;
