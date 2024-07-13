import jwt from "jsonwebtoken";

const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "3d",
  });
};

export default generateRefreshToken;
