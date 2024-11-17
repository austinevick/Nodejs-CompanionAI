import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import authRouter from './controllers/auth_controllers.js';
import conversationRouter from './controllers/conversation_controller.js';
import dotenv from 'dotenv';


dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', authRouter);
app.use('/api', conversationRouter);


const port = 3000;

app.listen(port, async () => {

    mongoose.connect(process.env.MONGO_URI)
        .then(e => console.log("Connected to db succesfully")
        ).catch(e => console.log("Error connecting to db")
        );

    console.log(`Server running on port ${ port }`);
});