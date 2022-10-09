import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/error.js";
import tryCatchHandler from "./tryCatchHandler.js";
import UserModel from "../models/UserModel.js";
const auth = tryCatchHandler(async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return next(new ErrorHandler(406, "Token required.."));
  }

  const { userID } = await jwt.verify(token, process.env.JWT_SECRET);

  if (!userID) {
    return next(new ErrorHandler(406, "Invalid token.."));
  }

  const user = await UserModel.findById(userID);

  if (!user) {
    return next(new ErrorHandler(406, "Invalid token.."));
  }

  req.user = user;
  next();
});

export default auth;
