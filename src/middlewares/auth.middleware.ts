import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { iUser } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user: iUser;
    }
  }
}

export const authUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      try {
        if (token) {
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY as string
          );
          if (!decoded) {
            res.status(401);
            throw new Error("Not authorized, token expired");
          }

          const user = await User.findById((decoded as JwtPayload).id).select(
            "-password"
          );
          if (!user) {
            res.status(401);
            throw new Error("User not found");
          }
          req.user = user;
          next();
        }
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, invalid token");
      }
    } else {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
);

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req?.user?.isAdmin) next();
  else {
    res.status(401);
    throw new Error("You are not the admin");
  }
};
