import { UserModel } from "../Models/user.js";
import bcrypt from 'bcrypt';
import jsonwebtoken from "jsonwebtoken"

export const Signup = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        const user = await UserModel.findOne({email});
        if (user) {
            return res.status(409).json({
                message: "User is already exist.",
                success: false
            })
        }

        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        return res.status(201).json({
            message: "User created successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server error",
            success: false
        })
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await UserModel.findOne({email});
        if (!user) {
            return res.status(403).json({
                message: "Something went wrong, check email or password",
                success: false
            })
        }

        const isPassword = await bcrypt.compare(password, user.password);

        if(!isPassword) {
            return res.status(403).json({
                message: "Something went wrong, check email or password",
                success: false
            })
        }

        const jwtToken = jsonwebtoken.sign({email: user.email, _id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "24h"}
        )

        return res.status(200).json({
            message: "Login Successful",
            success: true,
            jwtToken,
            email,
            name: user.name
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server error",
            success: false
        })
    }
}