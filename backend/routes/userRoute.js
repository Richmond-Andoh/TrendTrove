import express from "express";
import { createUser, deleteUser, getAllUsers, getCurrentUser, getUserById, logoutUser, updateCurrentUser, updateUserById, userLogin } from "../controllers/userController.js";
import { authenticateUser, authorizeUser } from "../middlewares/auth.js";
const router = express.Router()

router.route("/").post(createUser).get(authenticateUser, authorizeUser, getAllUsers)
router.post("/auth", userLogin)
router.post("/logout", logoutUser)

router
.route("/userProfile")
.get(authenticateUser, getCurrentUser)
.put(authenticateUser, updateCurrentUser)


//Admin route
router
.route("/:id")
.delete(authenticateUser, authorizeUser, deleteUser)
.get(authenticateUser, authorizeUser, getUserById)
.put(authenticateUser, authorizeUser, updateUserById)


export default router