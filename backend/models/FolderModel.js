import mongoose from "mongoose";
import UserModel from "./UserModel.js";
const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "All fields Required..."],
    },
    owner_folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    subFolders: [
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
    subFiles: [
      {
        public_id: {
          type: String,
          required: true,
        },
        file_url: {
          type: String,
          required: true,
        },
        file_name:{
          type: String,
          required: true,
        },
        size:{
          type: Number,
          required: true,
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

const FolderModel = new mongoose.model("FolderModel", folderSchema);

export default FolderModel;
