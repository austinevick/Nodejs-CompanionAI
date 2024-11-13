import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    prompt: String,
    response: String
}, {
    timestamps: true
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;