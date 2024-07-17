import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // validate
    if (!name || !email || !password) {
      const error = createHttpError(400, "All Fields are Required!");
      return next(error);
    }

    // database call
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(
        400,
        "User Already Exists with this Email!"
      );
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
  } catch (error) {
    return next(createHttpError(500, "Error While Registering User"));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password) {
      return next(createHttpError(400, "All fields are required!"));
    }

    // database call
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not Found!"));
    }

    // validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(400, "Invalid User Credentials!"));
    }

    // Token generation JWT
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    return res.json({
      accessToken: token,
      message: "User Logged In Successfully!",
    });
  } catch (error) {
    return next(createHttpError(500, "Error while Login In"));
  }
};

export { createUser, loginUser };
