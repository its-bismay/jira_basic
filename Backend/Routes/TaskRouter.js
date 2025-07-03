import express from 'express'
import { createTaskValidation } from '../Middlewares/taskValidation.js';
import { createTask } from '../controllers/task.Controller.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';


export const taskRouter = express.Router();

taskRouter.post('/create/task',authMiddleware, createTaskValidation, createTask);
