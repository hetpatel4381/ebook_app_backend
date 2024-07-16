import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    message: err.message,
    // we should not use errStack in production since it can lead to expose of the internal data or internal things which might create an issue as well for big companies.
    errorStack: config.env === "development" ? err.stack : "",
  });
};

export default globalErrorHandler;
