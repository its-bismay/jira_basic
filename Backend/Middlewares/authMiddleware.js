import jwt from "jsonwebtoken";
import { UserModel } from "../Models/user.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided", success: false });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Optionally, fetch the user from DB for more info
    const user = await UserModel.findById(decoded._id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }
    req.user = user; // Attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};
