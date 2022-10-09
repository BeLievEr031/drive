import mongoose, { mongo } from "mongoose";
import validator from "email-validator";
import FolderModel from "./FolderModel.js";
const usereSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "All fields Required..."],
    },
    email: {
      type: String,
      required: [true, "All fields Required..."],
      unique: true,
      validate: function () {
        return validator.validate(this.email);
      },
    },
    password: {
      type: String,
      select: false,
      required: [true, "All fields Required..."],
    },
    folders: [
      {
        folderid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "FolderModel",
        },
        name: {
          type: String,
        },
      },
    ],

    files: [
      {
        public_id: {
          type: String,
          required: true,
        },
        file_url: {
          type: String,
          required: true,
        },
        file_name: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = new mongoose.model("UserModel", usereSchema);

export default UserModel;
