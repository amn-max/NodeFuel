import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import APIError from "../errors/api-error";

function restrictToSelf(req: Request, res: Response, next: NextFunction) {
  // Check if user is authenticated
  if (!req.isAuthenticated()) {
    const err = new APIError({
      message: "Unauthorized",
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    });
    return next(err);
  }

  // Check if the requested user data matches the authenticated user's data
  const requestedUserId = req.params.id;
  const reqUser: any = req.user;
  const authenticatedUserId = reqUser.id;
  if (requestedUserId != authenticatedUserId) {
    const err = new APIError({
      message: "Access denied",
      status: httpStatus.FORBIDDEN,
      isPublic: true,
    });
    return next(err);
  }

  // User is authorized to access their own data
  next();
}

export default restrictToSelf;
