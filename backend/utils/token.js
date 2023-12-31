import jwt from "jsonwebtoken"

const createToken = (res, userId) => {
    const token = jwt.sign({userId}, process.env.SECRET_TOKEN, { expiresIn: "25d"})

    res.cookie("jwt", token, {
        httpOnly: true,  //it means the cookie only accessible through HTTP(S) and not JS/Browser
        sameSite: "strict" 
    })
}

export default createToken