import { Request, Response, NextFunction } from "express";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: "User Created!" });
};

export { createUser };
