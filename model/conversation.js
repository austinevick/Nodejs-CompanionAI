import mongoose from 'mongoose';


const conversationSchema = new mongoose.Schema({
    message: { type: String },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timeSent: { type: Number }
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;