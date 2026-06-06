import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, unique:true},
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    role: {type: String, default: "user", enum: ["user", "admin"]},
    savedListings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Listing"
        }
    ]
}, {timestamps: true});

export default mongoose.model("User", userSchema);