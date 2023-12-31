import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs"
import createToken from "../utils/token.js";

const createUser = asyncHandler(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // check for empty fields
        if (!username || !email || !password) {
            throw new Error("All fields must be filled")
        }

        // check for user existence
        const userExist = await User.findOne({email})
        if(userExist){
           res.status(400).send("Email already in use")
        }

        //Hash password
        const saltRounds = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, saltRounds)

        // create a new user
        const newUser = new User({ username, email, password: hashPassword })
        await newUser.save()
        createToken(res, newUser._id)
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        })
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({Message: "Internal Server Error"})
        
    }
    
    
})  

export { createUser }