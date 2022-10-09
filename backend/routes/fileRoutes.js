import express from "express";
import {
  uploadFile,
  uploadSubFile,
  deleteFile,
  getFiles,
  getSubFiles,
  deleteSubFile,
} from "../controller/fileController.js";
import upload from "../utils/multer.js";
const fileRoute = express.Router();
import auth from "../middleware/auth.js";

// Get the file
fileRoute.get("/get/:filename", getFiles);

// Get the all file
fileRoute.get("/get", auth, getFiles);

// Get the all subFile
fileRoute.get("/get/sub/:parentID", auth, getSubFiles);

// Post upload File
fileRoute.post("/upload", auth, upload.single("file"), uploadFile);

// Post upload subFile
fileRoute.post("/upload/:parentID", auth, upload.single("file"), uploadSubFile);

// Delete the File
fileRoute.delete("/delete/:fileID", auth, deleteFile);

// Delete the subFile
fileRoute.delete("/delete/sub/:parentID/:fileID", auth, deleteSubFile);

export default fileRoute;
