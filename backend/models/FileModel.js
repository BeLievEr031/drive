import mongoose from "mongoose";
import UserModel from "./UserModel.js";
const fileSchema = new mongoose.Schema(
  {
    imgurl: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "All fields Required..."],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
  },
  {
    timestamps: true,
  }
);

const FileModel = new mongoose.model("FileModel", fileSchema);

export default FileModel;
