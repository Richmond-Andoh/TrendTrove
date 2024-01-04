import jwt from "jsonwebtoken"
import asynHandler from "./asyncHandler.js"
import User from "../models/userModel.js"


const authenticateUser = asynHandler(async(req, res, next) => {
    // Get token from header
    let token = req.cookies.jwt;

    if(token){
        try {
            const decode = jwt.verify(token, process.env.SECRET_TOKEN)
            req.user = await User.findById(decode.userId).select("-password")
            next()
        } catch (error) {
            res.status(401)
            throw new Error("User not authorized, Token failed")
        }
    }
    else {
        res.status(401)
        throw new Error("User not authorized, no token")
    }
})


const authorizeUser = asynHandler(async(req, res, next) => {
    if(req.user && req.user.isAdmin) return next();
    else res.status(401).send("User not autorized as an Admin")
})

export { authenticateUser, authorizeUser}