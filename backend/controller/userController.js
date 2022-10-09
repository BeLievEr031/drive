import tryCatchHandler from "../middleware/tryCatchHandler.js";
import UserModel from "../models/UserModel.js";
import ErrorHandler from "../utils/error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//add new user
const registerUser = tryCatchHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler(406, "All fields required.."));
  }

  const isExist = await UserModel.findOne({ email });
  if (isExist) {
    return next(new ErrorHandler(401, "user Already Exists..."));

  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new UserModel({
    name,
    email,
    password: hashedPassword,
  });

  await user.save();

  res.status(200).json({
    success: true,
    msg: "User Register",
    user,
  });
});

//upadte existing user
const updateUser = tryCatchHandler(async (req, res, next) => {
  const { name, password } = req.body;
  let user = req.user;
  if (name) {
    user = await UserModel.findByIdAndUpdate(
      {
        _id: user._id,
      },
      {
        $set: {
          name,
        },
      }
    );
  }

  res.status(200).json({
    status: true,
    msg: "User updated..",
  });

  // password updation remaining
});

//delete existing user
const deleteUser = tryCatchHandler(async (req, res, next) => {
  let user = req.user;
  user = await UserModel.findById(user._id);

  await user.remove();
  res.satus(200).json({
    status: true,
    msg: "Account Deleted successfully...",
  });
});

//get single existing user
const getUser = tryCatchHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "User fetched..",
    user: req.user,
  });
});

//login existing user
const loginUser = tryCatchHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler(406, "All fields required.."));
  }

  const isUser = await UserModel.findOne({ email }).select("+password");

  if (!isUser) {
    return next(new ErrorHandler(401, "Invalid Credentials.."));
  }

  let user = isUser;
  const isPassword = await bcrypt.compare(password, user.password);

  if (!isPassword) {
    return next(new ErrorHandler(401, "Invalid Credentials.."));
  }

  const token = jwt.sign(
    {
      userID: user._id,
    },
    process.env.JWT_SECRET
  );

  res.status(200).json({
    success: true,
    token,
    msg: "User Logged In..",
    user,
  });
});

export { getUser, registerUser, updateUser, deleteUser, loginUser };
