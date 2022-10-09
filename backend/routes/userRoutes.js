import express from "express";
import auth from "../middleware/auth.js";
import {
  getUser,
  registerUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../controller/userController.js";

const userRouter = express.Router();

// sign-up
userRouter.post("/register", registerUser);

// get user
userRouter.get("/me", auth, getUser);

// update user info
userRouter.put("/update", auth, updateUser);

// delete user permanentaly
userRouter.delete("/delete", auth, deleteUser);

// Login user
userRouter.post("/login", loginUser);

export default userRouter;

// otp ka work
// password updation
// user delete hone per saare usake data ko delete karana
