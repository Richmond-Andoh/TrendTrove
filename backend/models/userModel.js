import mongoose, { model } from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true 
    },

    email: {
        type: String,
        require: true,
        unique: true
    },

    password:{
        type: String,
        require: true,
    },

    isAdmin: {
        type: Boolean,
        require: true,
        default: false
    }
}, { timestamps:  true})


const User = mongoose.model("User", userSchema)

export default User