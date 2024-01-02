import express from "express";
import { createUser, logoutUser, userLogin } from "../controllers/userController.js";
const router = express.Router()

router.route("/").post(createUser)
router.post("/auth", userLogin)
router.post("/logout", logoutUser)



export default router