import express from 'express'
import { loginValidation, signupValidation } from '../Middlewares/authValidation.js';
import { login, Signup } from '../controllers/auth.Controller.js';

export const authRouter = express.Router();

authRouter.post('/signup', signupValidation, Signup )

authRouter.post('/login', loginValidation, login )