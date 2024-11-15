import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import fs from 'fs';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Conversation from './model.js';
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const port = 3000;

const configuration = new GoogleGenerativeAI(process.env.APIKEY);
const modelId = "gemini-1.5-flash";
const model = configuration.getGenerativeModel({ model: modelId });

const files = multer({

});


// Converts local file information to a GoogleGenerativeAI.Part object.
function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
        },
    };
}

app.post("/api/gen/image", async (req, res) => {
    try {
        if (!req.body.prompt) return res.status(400).json({
            status: 400,
            message: "Please enter a message"
        });
        const prompt = "What's different between these pictures?";
        files.array(fieldName);
        const imageParts = [
            fileToGenerativePart("image1.png", "image/png"),
            fileToGenerativePart("image2.jpeg", "image/jpeg"),
        ];
        const result = await model.generateContent([prompt, ...imageParts]);
        const tokenCount = await model.countTokens(req.body.prompt)
            .then(e => e.totalTokens);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        return res.status(200).json({
            status: 200,
            message: "Success",
            data: text,
            tokenCount: tokenCount
        });

    } catch (error) {

    }
});


app.post("/api/generate", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({
            status: 400,
            message: "Please enter a message"
        });
        const result = await model.generateContent(prompt);
        const tokenCount = await model.countTokens(prompt)
            .then(e => e.totalTokens);

        const conversation = new Conversation({
            prompt: prompt,
            response: result.response.text()
        });

        const data = await conversation.save();

        return res.status(200).json({
            status: 200,
            message: "Success",
            data: data,
            tokenCount: tokenCount
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
});

app.get("/api/conversations", async (req, res) => {

    try {
        const data = await Conversation.find({});
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



app.listen(port, async () => {

    mongoose.connect(process.env.MONGO_URI)
        .then(e => console.log("Connected to db succesfully")
        ).catch(e => console.log("Error connecting to db")
        );

    console.log(`Server running on port ${ port }`);
});