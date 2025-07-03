// controllers/userController.js
import { UserModel } from "../Models/user.js";

export const getAllUsers = async (req, res) => {
  try {
    // Exclude password and sensitive fields
    const users = await UserModel.find({}, "name email _id");
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};
