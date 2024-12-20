import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String },
    conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
});


const UserModel = mongoose.model("User", userSchema);

export default UserModel;
