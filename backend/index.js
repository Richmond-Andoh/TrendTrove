import express from "express";
import path from "path"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
//utils
import dbconnection from "./configs/dbconnection.js"
import userRoute from "./routes/userRoute.js"

dotenv.config()

dbconnection()
const PORT = process.env.PORT || 5900


const app = express();

app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use("/api/users", userRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})