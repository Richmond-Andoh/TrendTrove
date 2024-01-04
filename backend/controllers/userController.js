import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs"
import createToken from "../utils/token.js";


// Create User 
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

// User  Login method
const userLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const userExisting = await User.findOne({ email })
    if(userExisting) {
        const isPasswordValid = await bcrypt.compare(password, userExisting.password)
        if(isPasswordValid){
            createToken(res, userExisting._id)
            res.status(201).json({
                _id: userExisting._id,
                username: userExisting.username,
                email: userExisting.email,
                isAdmin: userExisting.isAdmin
            })
            return;
        }
    }
});

// User Logout method
const logoutUser = asyncHandler(async(req, res) => {
    //remove the token from the database and set it to null on the client side
    res.cookie("jwt", "", {
        httyOnly: true,
        expires: new Date(0) 
    })

    res.status(200).json({Message: "User has been successfully logged out"})
})


// Get All Users
const getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find({})
    res.json(users)
})

// Get current User 
const getCurrentUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)

    if(user){
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email
        })
    }
    else {
        res.status(401)
        throw new Error("User not found.")
    }
})

// Update current User 
const updateCurrentUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)

    if(!user){
        res.status(404)
        throw new Error("User not found")
    }
    else {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email

        if(req.body.password){
            user.password = req.body.password
        }

        const updateUser = await user.save();

        res.status(500).json({
            _id: updateUser._id,
            username: updateUser.username,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin
        })
    }
})


// Delete Current User by ID
const deleteUser = asyncHandler(async(req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);

    if(user){
        if(isAdmin){
            res.send("Cannot delete Admin")
        }

        await user.delete({_id: user._id})
        res.json({Message: "User deleted successfully"})
    }
    else {
        res.status(404)
        throw new Error("User not found")
    }
})


// Get user by ID

const getUserById = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id).select("-password")

    if(user){
        res.json(user)
    }
    else {
        res.status(404)
        throw new Error("User not found")
    }
})

// Update User by ID

const updateUserById = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id)
    // Checking for existing user and updating the fields that are passed in the request body
    if(user){
        user.username = req.body.username || user.username
        user.email = req.body.email || user.email
        user.isAdmin = Boolean(req.body.isAdmin)

        const updateUser = await user.save()
        res.json({
            _id: updateUser._id,
            username: updateUser.username,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin
        })
    }
    else {
        res.status(404)
        throw new Error("User Not Found")
    }
})
export { createUser, userLogin, logoutUser, getAllUsers, getCurrentUser, updateCurrentUser, deleteUser, getUserById, updateUserById }
