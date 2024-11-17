
import express from 'express';
import UserModel from '../model/user.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const authRouter = express.Router();



authRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await UserModel.findOne({ username: username });
        if (!existingUser) {
            return res.status(400).json({
                status: 400,
                message: "User does not exist"
            });
        }
        if (!bcrypt.compareSync(password, existingUser.password)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid credential"
            });
        }

        const data = await UserModel.findById(existingUser._id).select('-password');

        return res.status(200).json({
            status: 200,
            message: 'User account found',
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
});

authRouter.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await UserModel.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({
                status: 400,
                message: "User already exist"
            });
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new UserModel({ username: username, password: hashedPassword });
        await newUser.save();
        const data = await UserModel.findById(newUser._id).select('-password');

        return res.status(200).json({
            status: 200,
            message: 'User account created successfully',
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
});

export default authRouter;
