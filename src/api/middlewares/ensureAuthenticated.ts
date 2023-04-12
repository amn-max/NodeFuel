import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
const APIError = require("../errors/api-error");
function ensureAuthenticated(req:Request, res:Response, next:NextFunction) {
    if (req.isAuthenticated()) { return next(); }
    else{
      const err = new APIError({
      message: 'Unauthorized',
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    });
    return next(err);
    }
  }

  export default ensureAuthenticated