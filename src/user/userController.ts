import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = createHttpError(400, "All Fields are Required!");
    return next(error);
  }
  // validate
  // process
  // response
  return res.json({ message: "User Created!" });
};

export { createUser };
