import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // validate
  if (!name || !email || !password) {
    const error = createHttpError(400, "All Fields are Required!");
    return next(error);
  }

  // database call
  const user = await userModel.findOne({ email });
  if (user) {
    const error = createHttpError(400, "User Already Exists with this Email!");
    return next(error);
  }

  // password -> hash
  const hashedPassword = await bcrypt.hash(password, 10);

  // process
  // response
  return res.json({ message: "User Created!" });
};

export { createUser };
