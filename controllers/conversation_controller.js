import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Conversation from '../model/conversation.js';
import UserModel from '../model/user.js';
import dotenv from 'dotenv';

dotenv.config();

const conversationRouter = express.Router();

const configuration = new GoogleGenerativeAI(process.env.APIKEY);
const modelId = "gemini-1.5-flash";
const model = configuration.getGenerativeModel({ model: modelId });



/// Create a conversation
conversationRouter.post("/generate", async (req, res) => {
    try {
        const { userId, prompt } = req.body;
        if (!prompt) return res.status(400).json({
            status: 400,
            message: "Please enter a message"
        });
        if (!userId) return res.status(400).json({
            status: 400,
            message: "UserId is required"
        });
        const result = await model.generateContent(prompt);
        const tokenCount = await model.countTokens(prompt)
            .then(e => e.totalTokens);

        const userConversation = new Conversation({
            sender: userId,
            receiver: '6739ac9916ad3b3077d147df',
            message: prompt
        });
        await userConversation.save();
        await UserModel.findByIdAndUpdate(userId,
            {
                $push: { conversations: userConversation },
            },
            { new: true }
        ).exec();

        const aiConversation = new Conversation({
            sender: '6739ac9916ad3b3077d147df',
            receiver: userId,
            message: result.response.text()
        });
        await UserModel.findByIdAndUpdate("6739ac9916ad3b3077d147df",
            {
                $push: { conversations: aiConversation },
            },
            { new: true }
        ).exec();
        await aiConversation.save();

        return res.status(200).json({
            status: 200,
            message: "Success",
            data: aiConversation,
            tokenCount: tokenCount
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
});

/// Get all conversations
conversationRouter.get("/conversations", async (req, res) => {

    try {
        const data = await Conversation.find({})
            .populate({ path: 'sender', select: '-password', populate: 'conversations' })
            .populate({ path: 'receiver', select: '-password', populate: 'conversations' });
        return res.status(200).json({
            status: 200,
            message: "Success",
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
});


/// Get conversations for a specific user
conversationRouter.get("/conversations/:userid", async (req, res) => {

    try {
        const data = await Conversation.find({ sender: req.params.userid });
        // .populate(
        //     {
        //         path: 'sender', select: '-password', populate: 'conversations'
        //     }
        // ).populate(
        //     {
        //         path: 'receiver', select: '-password', populate: 'conversations'
        //     }
        // );

        return res.status(200).json({
            status: 200,
            message: "Success",
            data: data
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
});





export default conversationRouter;