import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

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

  // create new user
  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  // Token generation JWT
  const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
    expiresIn: "7d",
  });

  // process
  // response
  return res.json({ accessToken: token });
};

export { createUser };
