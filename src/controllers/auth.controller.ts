import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model";
import generateToken from "../utils/generateToken";
import generateRefreshToken from "../utils/generateRefreshToken";
import jwt, { JwtPayload } from "jsonwebtoken";

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
      const refreshToken = generateRefreshToken(user._id);
      await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.status(200).json({
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
        cart: user.cart,
        access_token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  }
);

// HANDLE REFRESH TOKEN
export const handleRefreshToken = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const cookie = req.cookies;
    if (!cookie) throw new Error("No refresh token");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error("No refresh token/not matched in database");
    jwt.sign(
      refreshToken,
      process.env.JWT_SECRET_KEY as string,
      (err: any, decoded: any) => {
        if (err || user?.id !== decoded?.id)
          throw new Error("There is something wrong with refresh token");
        const access_token = generateToken(user?.id);
        res.json(access_token);
      }
    );
  }
);

// LOGOUT USER
export const logoutUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const cookie = req.cookies;
    if (!cookie) throw new Error("No refresh token");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
      res.sendStatus(204);
      return;
    }

    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.sendStatus(204);
  }
);

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
