import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model";
import generateToken from "../utils/generateToken";

// REGISTER USER
export const registerUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { username } = req.body;
    const duplicate = await User.findOne({ username });
    if (duplicate) {
      res.status(400);
      throw new Error("User already exists");
    }

    const newUser = await User.create(req.body);
    res.status(200).json({
      _id: newUser._id,
      username: newUser.username,
      fullName: newUser.fullName,
      avatar: newUser.avatar,
      isAdmin: newUser.isAdmin,
      cart: newUser.cart,
    });
  }
);

// LOGIN USER
export const loginUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400);
      throw new Error("Invalid username or password");
    }

    if (await user.comparePasswords(password)) {
      res.status(200).json({
        user,
        access_token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  }
);

// LOGOUT USER
// export const logoutUser = expressAsyncHandler(async(req:Request, res:Response) => {

// })

// AUTH USER
export const getMe = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = await User.findById(req?.user._id).select("-password");
    if (!user) {
      res.status(500);
      throw new Error("Internal Server Error");
    }
    res.status(200).json(user);
  }
);
