import express from "express";
import 'dotenv/config'
import { connectDb } from "./Models/db.js";
import bodyParser from "body-parser";
import cors from 'cors';
import { authRouter } from "./Routes/AuthRouter.js";
import { taskRouter } from "./Routes/TaskRouter.js";
import { userRouter } from "./Routes/UserRouter.js";
import { taskControllerRouter } from "./Routes/TaskControllerRoute.js";



const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req,res) => {
    res.send("server is running")
})

app.use(bodyParser.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use('/auth', authRouter)
app.use('/api', taskRouter)
app.use('/api', userRouter)
app.use('/api', taskControllerRouter)


app.listen(port, () => {
  console.log(`server is running on ${port}`);
  connectDb()
});


