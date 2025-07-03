// routes/userRoutes.js
import express from "express";
import { getAllUsers } from "../controllers/user.Controller.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

export const userRouter = express.Router();

// Optionally, add authMiddleware if you want only logged-in users to fetch users
userRouter.get("/users", authMiddleware, getAllUsers);
